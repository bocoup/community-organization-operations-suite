/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ApolloQueryResult } from '@apollo/client'
import { useLazyQuery } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState } from '~store'
import { useEffect } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'
import { sortByDuration } from '~utils/engagements'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'

const logger = createLogger('useEngagementList')

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
	const [load, { loading, error, refetch, fetchMore }] = useLazyQuery(
		GET_USER_ACTIVES_ENGAGEMENTS,
		{
			fetchPolicy: 'cache-and-network',
			onCompleted: (data) => {
				const activeEngagements: Engagement[] = Array.from(data?.activeEngagements) ?? []
				setEngagementList(activeEngagements.sort(sortByDuration))
				const userActiveEngagements: Engagement[] = Array.from(data?.userActiveEngagements) ?? []
				setMyEngagementList(userActiveEngagements.sort(sortByDuration))
			},
			onError: (error) => logger(c('hooks.useEngagementList.loadDataFailed'), error)
		}
	)

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
