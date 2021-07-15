/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql, useSubscription } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@resolve/schema/lib/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState } from 'recoil'
import { inactiveEngagementListState } from '~store'
import { useEffect } from 'react'
import sortByDate from '~utils/sortByDate'
import { useTranslation } from '~hooks/useTranslation'
import { SUBSCRIBE_TO_ORG_ENGAGEMENTS } from './useEngagementList'

export const GET_INACTIVE_ENGAGEMENTS = gql`
	${EngagementFields}

	query inactiveEngagements($body: EngagementsInput!) {
		inactiveEngagements(body: $body) {
			...EngagementFields
		}
	}
`

interface useInactiveEngagementListReturn extends ApiResponse<Engagement[]> {
	inactiveEngagementList: Engagement[]
}

export function useInactiveEngagementList(
	orgId: string,
	userId: string
): useInactiveEngagementListReturn {
	const { c } = useTranslation('common')

	// Store used to save engagements list
	const [inactiveEngagementList, setInactiveEngagementList] = useRecoilState<Engagement[] | null>(
		inactiveEngagementListState
	)

	// Engagements query
	const { loading, error, data } = useQuery(GET_INACTIVE_ENGAGEMENTS, {
		variables: { body: { orgId, offset: 0, limit: 800 } },
		fetchPolicy: 'cache-and-network'
	})

	// Subscribe to engagement updates
	const { error: subscriptionError } = useSubscription(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
		variables: { body: { orgId } },
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
		if (subscriptionError) console.error('subscriptionError', subscriptionError)
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

	// Listen for engagements loaded
	useEffect(() => {
		if (data?.inactiveEngagements) {
			setInactiveEngagementList(data.inactiveEngagements)
		}
	}, [data, userId, setInactiveEngagementList])

	// Listen for errors on load engagements
	useEffect(() => {
		if (error) {
			console.error(c('hooks.useInactiveEngagementList.loadData.failed'), error)
		}
	}, [error, c])

	const engagementData: Engagement[] =
		(!loading && (data?.inactiveEngagements as Engagement[])) || inactiveEngagementList

	return {
		loading,
		error,
		inactiveEngagementList: engagementData
	}
}
