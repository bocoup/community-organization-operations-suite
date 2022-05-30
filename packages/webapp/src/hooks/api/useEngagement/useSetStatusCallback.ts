/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	Engagement,
	EngagementStatus,
	MutationSetEngagementStatusArgs
} from '@cbosuite/schema/dist/client-types'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useCallback } from 'react'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($engagementId: String!) {
		engagement(engagementId: $engagementId) {
			...EngagementFields
		}
	}
`
const SET_ENGAGEMENT_STATUS = gql`
	${EngagementFields}

	mutation setEngagementStatus($engagementId: String!, $status: EngagementStatus!) {
		setEngagementStatus(engagementId: $engagementId, status: $status) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type SetStatusCallback = (status: EngagementStatus) => void

export function useSetStatusCallback(id: string, orgId: string): SetStatusCallback {
	const { c } = useTranslation()
	const { userId } = useCurrentUser()
	const { failure, success } = useToasts()
	const [setEngagementStatus] = useMutation<any, MutationSetEngagementStatusArgs>(
		SET_ENGAGEMENT_STATUS
	)

	return useCallback(
		(status: EngagementStatus) => {
			setEngagementStatus({
				variables: { engagementId: id, status },
				update(cache, { data }) {
					const updatedID = data.setEngagementStatus.engagement.id
					const existingEngagements = cache.readQuery({
						query: GET_USER_ACTIVES_ENGAGEMENTS,
						variables: { orgId, userId, limit: 30 }
					}) as { engagements: Engagement[] }

					const newEngagements = existingEngagements?.engagements.map((e) => {
						if (e.id === updatedID) {
							return data.setEngagementStatus.engagement
						}
						return e
					})

					cache.writeQuery({
						query: GET_USER_ACTIVES_ENGAGEMENTS,
						variables: { orgId, userId, limit: 30 },
						data: { engagements: newEngagements }
					})

					cache.writeQuery({
						query: GET_ENGAGEMENT,
						variables: { engagementId: updatedID },
						data: { engagement: data.setEngagementStatus.engagement }
					})
				}
			})
				.then(() => success(c('hooks.useEngagement.setStatusSuccess', { status })))
				.catch((error) => failure(c('hooks.useEngagement.setStatusFailed', { status }), error))
		},
		[c, success, failure, id, orgId, userId, setEngagementStatus]
	)
}
