/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql, useMutation } from '@apollo/client'
import { ApiResponse } from './types'
import type { AuthenticationResponse, Engagement } from '@greenlight/schema/lib/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'

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
	addEngagement: (form: any) => void
}

// FIXME: update to only have ONE input as an object
export function useEngagementList(
	orgId: string,
	offset?: number,
	limit?: number,
	userId?: string,
	exclude_userId?: boolean
): useEngagementListReturn {
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	const { loading, error, data, refetch, fetchMore } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, offset, limit, userId, exclude_userId }
	})
	const [createEngagement] = useMutation(CREATE_ENGAGEMENT)

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	const addEngagement = async action => {
		const userId = get(authUser, 'user.id')
		const orgId = get(authUser, 'user.roles[0].orgId')
		console.log('action', action)
		console.log('userId', userId)
		console.log('orgId', orgId)

		const nextEngagement = {
			...action,
			userId,
			orgId
		}
		console.log('in add engagment', nextEngagement)

		// execute mutator
		await createEngagement({
			variables: {
				body: nextEngagement
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		addEngagement,
		data: engagementData
	}
}
