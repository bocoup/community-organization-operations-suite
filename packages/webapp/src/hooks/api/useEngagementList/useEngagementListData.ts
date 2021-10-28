/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLazyQuery, gql, ApolloQueryResult } from '@apollo/client'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState } from '~store'
import { useEffect } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'
const logger = createLogger('useEngagementList')

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query inactiveEngagements($orgId: String!, $offset: Int, $limit: Int) {
		activeEngagements(orgId: $orgId, offset: $offset, limit: $limit) {
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
			load({ variables: { orgId, offset: 0, limit: 800 } })
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

function sortByDuration(a: Engagement, b: Engagement) {
	const currDate = new Date()
	const aDate = a?.endDate ? new Date(a.endDate) : currDate
	const bDate = b?.endDate ? new Date(b.endDate) : currDate

	const aDuration = currDate.getTime() - aDate.getTime()
	const bDuration = currDate.getTime() - bDate.getTime()

	return aDuration > bDuration ? -1 : 1
}

function seperateEngagements(userId: string, engagements?: Engagement[]): Array<Array<Engagement>> {
	if (!engagements) return [[], []]

	const [currUserEngagements, otherEngagements] = engagements.reduce(
		(r, e) => {
			if (!!e.user?.id && e.user.id === userId) {
				r[0].push(e)
			} else {
				r[1].push(e)
			}

			return r
		},
		[[], []]
	)

	return [currUserEngagements, otherEngagements]
}
