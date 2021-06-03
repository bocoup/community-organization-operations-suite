/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { EngagementFields } from './fragments'

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

export function useEngagementList(
	orgId: string,
	offset?: number,
	limit?: number,
	userId?: string,
	exclude_userId?: boolean
): ApiResponse<Engagement[]> {
	const { loading, error, data, refetch, fetchMore } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, offset, limit, userId, exclude_userId }
	})

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	return {
		loading,
		error,
		refetch,
		fetchMore,
		data: engagementData
	}
}
