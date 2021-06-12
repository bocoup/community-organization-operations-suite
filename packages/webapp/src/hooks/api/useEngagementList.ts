/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql, useMutation } from '@apollo/client'
import { ApiResponse } from './types'
import type {
	AuthenticationResponse,
	Engagement,
	EngagementInput
} from '@greenlight/schema/lib/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAuthState, engagementListState } from '~store'
import { useEffect } from 'react'
import sortByDate from '~utils/sortByDate'

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query engagements(
		$orgId: String!
		$offset: Int
		$limit: Int
		$userId: String
		$exclude_userId: Boolean
	) {
		engagements(
			orgId: $orgId
			offset: $offset
			limit: $limit
			userId: $userId
			exclude_userId: $exclude_userId
		) {
			...EngagementFields
		}
	}
`

export const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($body: EngagementInput!) {
		createEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

interface useEngagementListReturn extends ApiResponse<Engagement[]> {
	addEngagement: (form: any) => Promise<void>
	engagementList: Engagement[]
}

// FIXME: update to only have ONE input as an object
export function useEngagementList(orgId: string, userId?: string): useEngagementListReturn {
	const authUser = useRecoilValue<AuthenticationResponse | null>(userAuthState)
	const [engagementList, setEngagmentList] = useRecoilState<Engagement[] | null>(
		engagementListState
	)
	const { loading, error, data, refetch, fetchMore } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, offset: 0, limit: 800, userId, exclude_userId: true },
		fetchPolicy: 'cache-and-network'
	})

	const [createEngagement] = useMutation(CREATE_ENGAGEMENT)

	if (error) {
		console.error('error loading data', error)
	}

	useEffect(() => {
		if (data?.engagements) {
			setEngagmentList(data.engagements)
		} else {
			setEngagmentList([])
		}
	}, [data, setEngagmentList])

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	const addEngagement = async (engagementInput: EngagementInput) => {
		const orgId = get(authUser, 'user.roles[0].orgId')

		const nextEngagement = {
			...engagementInput,
			orgId
		}

		// execute mutator
		await createEngagement({
			variables: {
				body: nextEngagement
			},
			update(cache, { data }) {
				// Check failure condition
				if (!data?.createEngagement?.engagement)
					throw new Error('Create engagement failed without error')

				// Update local list
				const nextEngagementList: Engagement[] = [
					data.createEngagement.engagement,
					...engagementList
				].sort((a, b) => sortByDate({ date: a.startDate }, { date: b.startDate }))

				// Set recoil variable
				setEngagmentList(nextEngagementList)
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		addEngagement,
		engagementList,
		data: engagementData
	}
}
