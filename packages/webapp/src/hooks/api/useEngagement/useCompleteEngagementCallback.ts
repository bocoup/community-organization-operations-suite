/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import type { MutationCompleteEngagementArgs } from '@cbosuite/schema/dist/client-types'

const COMPLETE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation completeEngagement($engagementId: String!) {
		completeEngagement(engagementId: $engagementId) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type CompleteEngagementCallback = () => void

export function useCompleteEngagementCallback(id?: string): CompleteEngagementCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [markEngagementComplete] = useMutation<any, MutationCompleteEngagementArgs>(
		COMPLETE_ENGAGEMENT
	)
	return () => {
		markEngagementComplete({
			variables: { engagementId: id }
		})
			.then(() => success(c('hooks.useEngagement.completeSuccess')))
			.catch((error) => failure(c('hooks.useEngagement.completeFailed'), error))
	}
}
