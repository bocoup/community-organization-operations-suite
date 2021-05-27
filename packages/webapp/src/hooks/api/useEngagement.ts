/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, useMutation, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { GET_ENGAGEMENTS } from './useEngagementList'

const GET_ENGAGEMENT = gql`
	query engagement($id: String!) {
		engagement(id: $id) {
			id
			orgId
			description
			status
			startDate
			endDate
			user {
				userName
				id
			}
		}
	}
`

const ASSIGN_ENGAGEMENT = gql`
	mutation assignEngagement($userId: String!, $id: String!) {
		assignEngagement(userId: $userId, id: $id) {
			message
			engagement {
				id
				orgId
				description
				status
				startDate
				endDate
				user {
					userName
					id
				}
			}
		}
	}
`

interface useEngagementReturn extends ApiResponse<Engagement> {
	assign: (userId: string) => void
}

export function useEngagement(id: string, orgId: string): useEngagementReturn {
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENT, {
		variables: { id }
	})

	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement = !loading && (data?.engagement as Engagement)

	const assign = async (userId: string) => {
		// execute mutator
		await assignEngagement({
			variables: {
				userId,
				id
			},
			update(cache, { data }) {
				const updatedID = data.assignEngagement.engagement.id
				const existingEngagements = cache.readQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 }
				}) as { engagements: Engagement[] }

				const newEngagements = existingEngagements?.engagements.map(e => {
					if (e.id === updatedID) {
						console.log('data.assignEngagement.engagement', data.assignEngagement.engagement)

						debugger
						return data.assignEngagement.engagement
					}
					return e
				})

				cache.writeQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 },
					data: { engagements: newEngagements }
				})

				// cache.modify({
				// 	fields: {
				// 		engagements(existingEngagements = []) {
				// 			const newEngagementRef = cache.writeFragment({
				// 				data: data.engagement,
				// 				fragment: gql`
				// 					fragment UpdatedEngagement on Engagement {
				// 						id
				// 						orgId
				// 						description
				// 						status
				// 						startDate
				// 						endDate
				// 						user {
				// 							userName
				// 							id
				// 						}
				// 					}
				// 				`
				// 			})
				// 			return [...existingEngagements, newEngagementRef]
				// 		}
				// 	}
				// })
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		assign,
		data: engagementData
	}
}
