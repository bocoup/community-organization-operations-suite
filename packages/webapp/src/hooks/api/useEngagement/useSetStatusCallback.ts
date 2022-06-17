/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	Engagement,
	EngagementStatus,
	MutationSetEngagementStatusArgs
} from '@cbosuite/schema/dist/client-types'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'
import { EngagementFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useCallback } from 'react'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($engagementId: String!) {
		engagement(engagementId: $engagementId) {
			...EngagementFields
		}
	}
`
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
	const { userId } = useCurrentUser()
	const { failure, success } = useToasts()
	const [setEngagementStatus] =
		useMutation<any, MutationSetEngagementStatusArgs>(SET_ENGAGEMENT_STATUS)

	return useCallback(
		(status: EngagementStatus) => {
			setEngagementStatus({
				variables: { engagementId: id, status },
				onCompleted: () => success(c('hooks.useEngagement.setStatusSuccess', { status })),
				onError: (e) => failure(c('hooks.useEngagement.setStatusFailed'), e.message)
			})
		},
		[c, success, failure, id, orgId, userId, setEngagementStatus]
	)
}
