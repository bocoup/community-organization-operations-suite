/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import type {
	EngagementInput,
	MutationCreateEngagementArgs
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'

const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($engagement: EngagementInput!) {
		createEngagement(engagement: $engagement) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type AddEngagementCallback = (e: EngagementInput) => void

export function useAddEngagementCallback(orgId: string): AddEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)

	return useCallback(
		(engagementInput: EngagementInput) => {
			createEngagement({ variables: { engagement: { ...engagementInput, orgId } } })
				.then(() => success(c('hooks.useEngagementList.addEngagement.success')))
				.catch((error) => failure(c('hooks.useEngagementList.addEngagement.failed'), error))
		},
		[orgId, success, failure, c, createEngagement]
	)
}
