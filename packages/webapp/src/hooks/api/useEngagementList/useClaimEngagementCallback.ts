/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import { useCallback } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { EngagementFields } from '../fragments'

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

export type ClaimEngagementCallback = (id: string, userId: string) => Promise<void>

export function useClaimEngagementCallback(): ClaimEngagementCallback {
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()
	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)

	return useCallback(
		async (id: string, userId: string) => {
			try {
				await assignEngagement({
					variables: { body: { engId: id, userId } }
				})

				success(c('hooks.useEngagementList.claimEngagement.success'))
			} catch (error) {
				failure(c('hooks.useEngagementList.claimEngagement.failed'), error)
			}
		},
		[c, success, failure, assignEngagement]
	)
}
