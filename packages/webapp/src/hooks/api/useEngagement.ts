/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLazyQuery, useMutation, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type {
	Engagement,
	EngagementStatus
} from '@community-organization-operations-suite/schema/lib/client-types'
import { GET_ENGAGEMENTS } from './useEngagementList'
import { EngagementFields } from './fragments'
import { useEffect } from 'react'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from './useCurrentUser'
import { engagementState } from '~store'
import { useRecoilState } from 'recoil'

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
	loadEngagement: (engagementId: string) => void
}

export function useEngagement(id?: string, orgId?: string): useEngagementReturn {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const { userId: currentUserId, orgId: currentOrgId } = useCurrentUser()
	const [engagementData, setEngagementData] = useRecoilState<Engagement | undefined>(
		engagementState
	)
	const [load, { loading, error, refetch }] = useLazyQuery(GET_ENGAGEMENT, {
		onCompleted: data => {
			if (data?.engagement) {
				setEngagementData(data.engagement)
			}
		},
		onError: error => {
			console.error(c('hooks.useEngagement.loadData.failed'), error)
		}
	})

	useEffect(() => {
		if (id) {
			load({ variables: { body: { engId: id } } })
		}
	}, [id, load])

	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)
	const [setEngagementStatus] = useMutation(SET_ENGAGEMENT_STATUS)
	const [addEngagementAction] = useMutation(ADD_ENGAGEMENT_ACTION)
	const [markEngagementComplete] = useMutation(COMPLETE_ENGAGEMENT)

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
		const userId = currentUserId
		const orgId = currentOrgId
		const nextAction = {
			...action,
			userId,
			orgId
		}

		try {
			await addEngagementAction({
				variables: { body: { engId: id, action: nextAction } },
				update(cache, { data }) {
					setEngagementData(data.addEngagementAction.engagement)
				}
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

	const loadEngagement = (engagementId: string) => {
		load({ variables: { body: { engId: engagementId } } })
	}

	return {
		loading,
		error,
		loadEngagement,
		refetch,
		assign,
		setStatus,
		addAction,
		completeEngagement,
		data: engagementData
	}
}
