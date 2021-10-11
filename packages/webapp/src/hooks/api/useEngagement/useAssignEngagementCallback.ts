/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

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

export type AssignEngagementCallback = (userId: string) => void

export function useAssignEngagementCallback(id: string): AssignEngagementCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)
	return useCallback(
		async (userId: string) => {
			try {
				await assignEngagement({
					variables: { body: { engId: id, userId } }
				})

				success(c('hooks.useEngagement.assign.success'))
			} catch (error) {
				failure(c('hooks.useEngagement.assign.failed'), error)
			}
		},
		[c, failure, id, success, assignEngagement]
	)
}
