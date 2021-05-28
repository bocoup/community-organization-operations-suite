/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, useMutation, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement, EngagementStatus } from '@greenlight/schema/lib/client-types'
import { GET_ENGAGEMENTS } from './useEngagementList'
import { EngagementFields } from './fragments'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($id: String!) {
		engagement(id: $id) {
			...EngagementFields
		}
	}
`

const ASSIGN_ENGAGEMENT = gql`
	${EngagementFields}

	mutation assignEngagement($userId: String!, $id: String!) {
		assignEngagement(userId: $userId, id: $id) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const SET_ENGAGEMENT_STATUS = gql`
	${EngagementFields}

	mutation setEngagementStatus($id: String!, $status: EngagementStatus!) {
		setEngagementStatus(id: $id, status: $status) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

interface useEngagementReturn extends ApiResponse<Engagement> {
	assign: (userId: string) => void
	setStatus: (status: EngagementStatus) => void
}

export function useEngagement(id: string, orgId: string): useEngagementReturn {
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENT, {
		variables: { id }
	})

	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)
	const [setEngagementStatus] = useMutation(SET_ENGAGEMENT_STATUS)

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

						return data.assignEngagement.engagement
					}
					return e
				})

				cache.writeQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 },
					data: { engagements: newEngagements }
				})

				cache.writeQuery({
					query: GET_ENGAGEMENT,
					variables: { id: updatedID },
					data: { engagement: data.assignEngagement.engagement }
				})
			}
		})
	}

	const setStatus = async (status: EngagementStatus) => {
		// execute mutator
		await setEngagementStatus({
			variables: {
				id,
				status
			},
			update(cache, { data }) {
				const updatedID = data.setEngagementStatus.engagement.id
				const existingEngagements = cache.readQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 }
				}) as { engagements: Engagement[] }

				const newEngagements = existingEngagements?.engagements.map(e => {
					if (e.id === updatedID) {
						return data.setEngagementStatus.engagement
					}
					return e
				})

				cache.writeQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 },
					data: { engagements: newEngagements }
				})

				cache.writeQuery({
					query: GET_ENGAGEMENT,
					variables: { id: updatedID },
					data: { engagement: data.setEngagementStatus.engagement }
				})
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		assign,
		setStatus,
		data: engagementData
	}
}
