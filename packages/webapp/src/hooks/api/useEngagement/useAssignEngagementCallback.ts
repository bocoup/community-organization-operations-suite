/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'
import type { MutationAssignEngagementArgs } from '@cbosuite/schema/dist/client-types'

const ASSIGN_ENGAGEMENT = gql`
	${EngagementFields}

	mutation assignEngagement($engagementId: String!, $userId: String!) {
		assignEngagement(engagementId: $engagementId, userId: $userId) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type AssignEngagementCallback = (userId: string) => void

export function useAssignEngagementCallback(id: string): AssignEngagementCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [assignEngagement] = useMutation<any, MutationAssignEngagementArgs>(ASSIGN_ENGAGEMENT)
	return useCallback(
		async (userId: string) => {
			try {
				await assignEngagement({
					variables: { engagementId: id, userId }
				})

				success(c('hooks.useEngagement.assign.success'))
			} catch (error) {
				failure(c('hooks.useEngagement.assign.failed'), error)
			}
		},
		[c, failure, id, success, assignEngagement]
	)
}
