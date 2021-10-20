/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import { EngagementInput, MutationUpdateEngagementArgs } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '../useCurrentUser'

const UPDATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation updateEngagement($engagement: EngagementInput!) {
		updateEngagement(engagement: $engagement) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type EditEngagementCallback = (engagementInput: EngagementInput) => Promise<void>

export function useEditEngagementCallback(): EditEngagementCallback {
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const [updateEngagement] = useMutation<any, MutationUpdateEngagementArgs>(UPDATE_ENGAGEMENT)

	return useCallback(
		async (engagementInput: EngagementInput) => {
			const engagement = {
				...engagementInput,
				orgId
			}

			try {
				// execute mutator
				await updateEngagement({ variables: { engagement } })

				success(c('hooks.useEngagementList.editEngagement.success'))
			} catch (error) {
				failure(c('hooks.useEngagementList.editEngagement.failed'), error)
			}
		},
		[c, success, failure, updateEngagement, orgId]
	)
}
