/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLazyQuery, gql, useSubscription } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState } from 'recoil'
import { inactiveEngagementListState } from '~store'
import { useEffect } from 'react'
import { sortByDate } from '~utils/sorting'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { SUBSCRIBE_TO_ORG_ENGAGEMENTS } from './useEngagementList/useEngagementSubscription'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useInativeEngagementList')

export const GET_INACTIVE_ENGAGEMENTS = gql`
	${EngagementFields}

	query inactiveEngagements($orgId: String!, $offset: Int, $limit: Int) {
		inactiveEngagements(orgId: $orgId, offset: $offset, limit: $limit) {
			...EngagementFields
		}
	}
`

interface useInactiveEngagementListReturn extends ApiResponse<Engagement[]> {
	inactiveEngagementList: Engagement[]
}

export function useInactiveEngagementList(orgId?: string): useInactiveEngagementListReturn {
	const { c } = useTranslation(Namespace.Common)

	// Store used to save engagements list
	const [inactiveEngagementList, setInactiveEngagementList] = useRecoilState<Engagement[] | null>(
		inactiveEngagementListState
	)

	// Engagements query
	const [load, { loading, error }] = useLazyQuery(GET_INACTIVE_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			if (data?.inactiveEngagements) {
				setInactiveEngagementList(data.inactiveEngagements)
			}
		},
		onError: (error) => {
			if (error) {
				logger(c('hooks.useInactiveEngagementList.loadData.failed'), error)
			}
		}
	})

	useEffect(() => {
		if (orgId) {
			load({ variables: { orgId, offset: 0, limit: 800 } })
		}
	}, [orgId, load])

	// Subscribe to engagement updates
	const { error: subscriptionError } = useSubscription(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
		variables: { orgId },
		onSubscriptionData: ({ subscriptionData }) => {
			// Update subscriptions here
			const updateType = get(subscriptionData, 'data.engagementUpdate.action')
			const engagementUpdate = get(subscriptionData, 'data.engagementUpdate.engagement')

			// If the subscription updated sucessfully
			if (engagementUpdate) {
				// Handle socket update
				switch (updateType) {
					case 'CLOSED':
					case 'COMPLETED':
						addEngagementToList(engagementUpdate)
						break
				}
			}
		}
	})

	// Listen for errors to enagementUpdates subsciption
	useEffect(() => {
		if (subscriptionError) {
			logger('subscriptionError', subscriptionError)
		}
	}, [subscriptionError])

	// Helper funtion to add engagement to local store
	const addEngagementToList = (engagement: Engagement) => {
		// Update local list
		const nextEngagementList: Engagement[] = [engagement, ...inactiveEngagementList].sort((a, b) =>
			sortByDate({ date: a.startDate }, { date: b.startDate })
		)

		// Set recoil variable
		setInactiveEngagementList(nextEngagementList)
	}

	return {
		loading,
		error,
		inactiveEngagementList: inactiveEngagementList || []
	}
}
