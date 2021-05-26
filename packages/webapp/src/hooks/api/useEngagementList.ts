/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@greenlight/schema/lib/client-types'

const GET_ENGAGEMENTS = gql`
	query engagements($orgId: String!, $limit: Int) {
		engagements(orgId: $orgId, limit: $limit) {
			id
			orgId
			description
			status
			startDate
			endDate
			tags {
				id
				label
			}
			contact {
				id
				email
				phone
				dateOfBirth
				address {
					street
					unit
					city
					state
					zip
				}
				name {
					first
					last
				}
			}
			actions {
				user {
					id
					userName
					name {
						first
						middle
						last
					}
				}
				tags {
					id
					label
				}
				date
				comment
			}
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
