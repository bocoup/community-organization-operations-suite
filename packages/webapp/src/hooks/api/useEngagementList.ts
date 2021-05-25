/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from './useAuth'
import { useEffect } from 'react'

const GET_ENGAGEMENTS = gql`
	query engagements($orgId: String!, $limit: Int) {
		engagements(orgId: $orgId, limit: $limit) {
			orgId
			description
			status
			startDate
			endDate
			actions {
				user {
					id
					name {
						first
						middle
						last
					}
				}
				date
				comment
			}
		}
	}
`

export function useEngagementList(orgId: string): ApiResponse<Engagement[]> {
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, limit: 100 }
	})

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	useEffect(() => {
		console.log('engagementData', engagementData)
	}, [engagementData])

	return {
		loading,
		error,
		refetch,
		data: engagementData
	}
}
