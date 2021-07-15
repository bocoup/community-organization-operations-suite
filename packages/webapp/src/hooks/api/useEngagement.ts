/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, useMutation, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type {
	Engagement,
	EngagementStatus,
	AuthenticationResponse
} from '@resolve/schema/lib/client-types'
import { GET_ENGAGEMENTS } from './useEngagementList'
import { EngagementFields } from './fragments'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'
import useToasts from '~hooks/useToasts'
import { get } from 'lodash'
import { useTranslation } from '~hooks/useTranslation'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($body: EngagementIdInput!) {
		engagement(body: $body) {
			...EngagementFields
		}
	}
`

const ASSIGN_ENGAGEMENT = gql`
	${EngagementFields}

	mutation assignEngagement($body: EngagementUserInput!) {
		assignEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const SET_ENGAGEMENT_STATUS = gql`
	${EngagementFields}

	mutation setEngagementStatus($body: EngagementStatusInput!) {
		setEngagementStatus(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const COMPLETE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation completeEngagement($body: EngagementIdInput!) {
		completeEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const ADD_ENGAGEMENT_ACTION = gql`
	${EngagementFields}

	mutation addEngagementAction($body: EngagementActionInput!) {
		addEngagementAction(body: $body) {
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
	addAction: (action: { comment: string; taggedUserId?: string; tags?: string[] }) => void
	completeEngagement: () => void
}

export function useEngagement(id: string, orgId: string): useEngagementReturn {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENT, {
		variables: { body: { engId: id } }
	})
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)
	const [setEngagementStatus] = useMutation(SET_ENGAGEMENT_STATUS)
	const [addEngagementAction] = useMutation(ADD_ENGAGEMENT_ACTION)
	const [markEngagementComplete] = useMutation(COMPLETE_ENGAGEMENT)

	if (error) {
		console.error(c('hooks.useEngagement.loadData.failed'), error)
	}

	const engagementData: Engagement = !loading && (data?.engagement as Engagement)

	const assign = async (userId: string) => {
		try {
			await assignEngagement({
				variables: { body: { engId: id, userId } }
			})

			success(c('hooks.useEngagement.assign.success'))
		} catch (error) {
			failure(c('hooks.useEngagement.assign.failed'), error)
		}
	}

	const setStatus = async (status: EngagementStatus) => {
		try {
			await setEngagementStatus({
				variables: { body: { engId: id, status } },
				update(cache, { data }) {
					const updatedID = data.setEngagementStatus.engagement.id
					const existingEngagements = cache.readQuery({
						query: GET_ENGAGEMENTS,
						variables: { body: { orgId, limit: 30 } }
					}) as { engagements: Engagement[] }

					const newEngagements = existingEngagements?.engagements.map(e => {
						if (e.id === updatedID) {
							return data.setEngagementStatus.engagement
						}
						return e
					})

					cache.writeQuery({
						query: GET_ENGAGEMENTS,
						variables: { body: { orgId, limit: 30 } },
						data: { engagements: newEngagements }
					})

					cache.writeQuery({
						query: GET_ENGAGEMENT,
						variables: { body: { engId: updatedID } },
						data: { engagement: data.setEngagementStatus.engagement }
					})
				}
			})

			success(c('hooks.useEngagement.setStatus.success', { status }))
		} catch (error) {
			failure(c('hooks.useEngagement.setStatus.failed', { status }), error)
		}
	}

	const addAction = async action => {
		const userId = get(authUser, 'user.id')
		const orgId = get(authUser, 'user.roles[0].orgId')
		const nextAction = {
			...action,
			userId,
			orgId
		}

		try {
			await addEngagementAction({
				variables: { body: { engId: id, action: nextAction } }
			})

			// No success message needed
		} catch (error) {
			failure(c('hooks.useEngagement.addAction.failed'), error)
		}
	}

	const completeEngagement = async () => {
		try {
			await markEngagementComplete({
				variables: { body: { engId: id } }
			})

			success(c('hooks.useEngagement.complete.success'))
		} catch (error) {
			failure(c('hooks.useEngagement.complete.failed'), error)
		}
	}

	return {
		loading,
		error,
		refetch,
		assign,
		setStatus,
		addAction,
		completeEngagement,
		data: engagementData
	}
}
