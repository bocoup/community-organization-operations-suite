/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { EngagementFields } from '../fragments'
import { MutationAssignEngagementArgs } from '@cbosuite/schema/dist/client-types'

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

export type ClaimEngagementCallback = (id: string, userId: string) => Promise<void>

export function useClaimEngagementCallback(): ClaimEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const [assignEngagement] = useMutation<any, MutationAssignEngagementArgs>(ASSIGN_ENGAGEMENT)

	return useCallback(
		async (id: string, userId: string) => {
			try {
				await assignEngagement({
					variables: { engagementId: id, userId }
				})

				success(c('hooks.useEngagementList.claimEngagement.success'))
			} catch (error) {
				failure(c('hooks.useEngagementList.claimEngagement.failed'), error)
			}
		},
		[c, success, failure, assignEngagement]
	)
}
