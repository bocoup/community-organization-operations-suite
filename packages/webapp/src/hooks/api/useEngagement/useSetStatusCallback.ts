/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	EngagementStatus,
	MutationSetEngagementStatusArgs
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const SET_ENGAGEMENT_STATUS = gql`
	${EngagementFields}

	mutation setEngagementStatus($engagementId: String!, $status: EngagementStatus!) {
		setEngagementStatus(engagementId: $engagementId, status: $status) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type SetStatusCallback = (status: EngagementStatus) => void

export function useSetStatusCallback(id: string, orgId: string): SetStatusCallback {
	const { c } = useTranslation()
	const { failure, success } = useToasts()
	const [setEngagementStatus] = useMutation<any, MutationSetEngagementStatusArgs>(
		SET_ENGAGEMENT_STATUS
	)

	return useCallback(
		(status: EngagementStatus) => {
			setEngagementStatus({
				variables: { engagementId: id, status },
				onCompleted: () => success(c('hooks.useEngagement.setStatusSuccess', { status })),
				onError: (e) => failure(c('hooks.useEngagement.setStatusFailed'), e.message)
			})
		},
		[c, success, failure, id, setEngagementStatus]
	)
}
