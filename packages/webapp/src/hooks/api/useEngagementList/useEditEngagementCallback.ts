/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import type {
	EngagementInput,
	MutationUpdateEngagementArgs
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
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

export type EditEngagementCallback = (engagementInput: EngagementInput) => void

export function useEditEngagementCallback(): EditEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const [updateEngagement] = useMutation<any, MutationUpdateEngagementArgs>(UPDATE_ENGAGEMENT)

	return useCallback(
		(engagementInput: EngagementInput) => {
			updateEngagement({
				variables: { engagement: { ...engagementInput, orgId } },
				onCompleted: () => success(c('hooks.useEngagementList.editEngagement.success')),
				onError: (e) => failure(c('hooks.useEngagementList.editEngagement.failed'), e.message)
			})
		},
		[c, success, failure, updateEngagement, orgId]
	)
}
