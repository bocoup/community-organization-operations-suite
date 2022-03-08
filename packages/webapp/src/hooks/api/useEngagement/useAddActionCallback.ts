/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	Engagement,
	MutationAddEngagementActionArgs
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '../useCurrentUser'
import { engagementState } from '~store'
import { useRecoilState } from 'recoil'

const ADD_ENGAGEMENT_ACTION = gql`
	${EngagementFields}

	mutation addEngagementAction($engagementId: String!, $action: ActionInput!) {
		addEngagementAction(engagementId: $engagementId, action: $action) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`
export type AddActionCallback = (action: {
	comment: string
	taggedUserId?: string
	tags?: string[]
}) => void

export function useAddActionCallback(id: string) {
	const { c } = useTranslation()
	const { failure } = useToasts()
	const { userId: currentUserId, orgId: currentOrgId } = useCurrentUser()
	const [, setEngagementData] = useRecoilState<Engagement | undefined>(engagementState)
	const [addEngagementAction] = useMutation<any, MutationAddEngagementActionArgs>(
		ADD_ENGAGEMENT_ACTION
	)

	return useCallback(
		async (action) => {
			const userId = currentUserId
			const orgId = currentOrgId
			const nextAction = {
				...action,
				userId,
				orgId
			}

			try {
				await addEngagementAction({
					variables: { engagementId: id, action: nextAction },
					update(cache, { data }) {
						setEngagementData(data.addEngagementAction.engagement)
					}
				})

				// No success message needed
			} catch (error) {
				failure(c('hooks.useEngagement.addAction.failed'), error)
			}
		},
		[id, setEngagementData, failure, currentUserId, currentOrgId, c, addEngagementAction]
	)
}
