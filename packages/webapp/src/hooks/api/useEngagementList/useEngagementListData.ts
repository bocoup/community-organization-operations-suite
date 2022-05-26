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

	query activeEngagements($orgId: String!) {
		activeEngagements(orgId: $orgId) {
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
			if (data?.activeEngagements && userId) {
				const [myEngagementListNext, engagementListNext] = seperateEngagements(
					userId,
					data?.activeEngagements
				)
				setEngagementList(engagementListNext.sort(sortByDuration))
				setMyEngagementList(myEngagementListNext.sort(sortByDuration))
			}
		},
		onError: (error) => {
			if (error) {
				logger(c('hooks.useEngagementList.loadData.failed'), error)
			}
		}
	})

	useEffect(() => {
		if (orgId) {
			load({ variables: { orgId } })
		}
	}, [orgId, load])

	return {
		loading,
		error,
		refetch,
		fetchMore,
		engagementList: engagementList || empty,
		myEngagementList: myEngagementList || empty
	}
}
