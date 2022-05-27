/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ApolloQueryResult } from '@apollo/client'
import { useLazyQuery, gql } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState } from '~store'
import { useEffect } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'
import { seperateEngagements, sortByDuration } from '~utils/engagements'

const logger = createLogger('useEngagementList')

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query activeEngagements($orgId: String!, $userId: String!) {
		activeEngagements(orgId: $orgId, userId: $userId) {
			...EngagementFields
		}
		userActiveEngagements(orgId: $orgId, userId: $userId) {
			...EngagementFields
		}
	}
`
export interface EngagementDataResult {
	loading: boolean
	error: Error
	refetch?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	fetchMore?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	engagementList: Engagement[]
	myEngagementList: Engagement[]
}

// FIXME: update to only have ONE input as an object
export function useEngagementData(orgId?: string, userId?: string): EngagementDataResult {
	const { c } = useTranslation(Namespace.Common)

	// Store used to save engagements list
	const [engagementList, setEngagementList] = useRecoilState<Engagement[]>(engagementListState)
	const [myEngagementList, setMyEngagementList] =
		useRecoilState<Engagement[]>(myEngagementListState)

	// Engagements query
	const [load, { loading, error, refetch, fetchMore }] = useLazyQuery(GET_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			const activeEngagements: Engagement[] = Array.from(data?.activeEngagements) ?? []
			setEngagementList(activeEngagements.sort(sortByDuration))
			const userActiveEngagements: Engagement[] = Array.from(data?.userActiveEngagements) ?? []
			setMyEngagementList(userActiveEngagements.sort(sortByDuration))
		},
		onError: (error) => logger(c('hooks.useEngagementList.loadData.failed'), error)
	})

	useEffect(() => {
		if (orgId && userId) {
			load({ variables: { orgId, userId } })
		}
	}, [orgId, userId, load])

	return {
		loading,
		error,
		refetch,
		fetchMore,
		engagementList: engagementList || empty,
		myEngagementList: myEngagementList || empty
	}
}
