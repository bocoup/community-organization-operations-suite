/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { Engagement, EngagementStatus } from '@cbosuite/schema/dist/client-types'
import { GET_ENGAGEMENTS } from '../useEngagementList'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($body: EngagementIdInput!) {
		engagement(body: $body) {
			...EngagementFields
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

export type SetStatusCallback = (status: EngagementStatus) => void

export function useSetStatusCallback(id: string, orgId: string): SetStatusCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [setEngagementStatus] = useMutation(SET_ENGAGEMENT_STATUS)

	return useCallback(
		async (status: EngagementStatus) => {
			try {
				await setEngagementStatus({
					variables: { body: { engId: id, status } },
					update(cache, { data }) {
						const updatedID = data.setEngagementStatus.engagement.id
						const existingEngagements = cache.readQuery({
							query: GET_ENGAGEMENTS,
							variables: { body: { orgId, limit: 30 } }
						}) as { engagements: Engagement[] }

						const newEngagements = existingEngagements?.engagements.map((e) => {
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
		},
		[c, success, failure, id, orgId, setEngagementStatus]
	)
}
