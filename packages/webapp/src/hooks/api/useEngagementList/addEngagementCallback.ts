/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import { EngagementInput } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '../useCurrentUser'

const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($body: EngagementInput!) {
		createEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type AddEngagementCallback = (e: EngagementInput) => Promise<void>

export function useAddEngagementCallback(): AddEngagementCallback {
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const [createEngagement] = useMutation(CREATE_ENGAGEMENT)

	return useCallback(
		async (engagementInput: EngagementInput) => {
			const nextEngagement = {
				...engagementInput,
				orgId
			}
			try {
				// execute mutator
				await createEngagement({
					variables: {
						body: nextEngagement
					}
				})

				success(c('hooks.useEngagementList.addEngagement.success'))
			} catch (error) {
				failure(c('hooks.useEngagementList.addEngagement.failed'), error)
			}
		},
		[orgId, success, failure, c, createEngagement]
	)
}
