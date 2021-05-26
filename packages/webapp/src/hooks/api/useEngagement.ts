/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { ContactFields, ActionFields } from './fragments/engagements'

const GET_ENGAGEMENT = gql`
	${ContactFields}
	${ActionFields}
	query engagement($id: String!, $limit: Int) {
		engagement(id: $id, limit: $limit) {
			id
			orgId
			description
			status
			startDate
			endDate
			user {
				id
			}
			tags {
				...TagFields
			}
			contact {
				...ContactFields
			}
			actions {
				...ActionFields
			}
		}
	}
`

interface useEngagementReturn extends ApiResponse<Engagement> {
	assign: (userId: string) => void
}

export function useEngagement(id: string): useEngagementReturn {
	// TODO: write resolver for individual engagement
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENT, {
		variables: { id }
	})

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement = !loading && (data?.engagement as Engagement)
	const assign = (userId: string) => {
		// execute mutator
		// client.mutate
		console.log('assign user', userId)
	}

	return {
		loading,
		error,
		refetch,
		assign,
		data: engagementData
	}
}
