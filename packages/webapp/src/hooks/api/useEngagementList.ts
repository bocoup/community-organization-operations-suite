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
	query engagements($orgId: String!, $limit: Int) {
		engagements(orgId: $orgId, limit: $limit) {
			...EngagementFields
		}
	}
`

export function useEngagementList(orgId: string): ApiResponse<Engagement[]> {
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, limit: 30 }
	})

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	return {
		loading,
		error,
		refetch,
		data: engagementData
	}
}
