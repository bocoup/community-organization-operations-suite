/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	MutationMarkMentionDismissedArgs,
	StatusType,
	User,
	UserResponse
} from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { MessageResponse } from '../types'
import { MentionFields } from '../fragments'

const MARK_MENTION_DISMISSED = gql`
	${MentionFields}

	mutation markMentionDismissed(
		$userId: String!
		$dismissAll: Boolean
		$engagementId: String
		$createdAt: String
	) {
		markMentionDismissed(
			userId: $userId
			dismissAll: $dismissAll
			engagementId: $engagementId
			createdAt: $createdAt
		) {
			user {
				mentions {
					...MentionFields
				}
			}
			message
			status
		}
	}
`

export type DismissMentionCallback = (
	userId: string,
	engagementId: string,
	createdAt: string,
	dismissAll: boolean
) => Promise<MessageResponse>

export function useDismissMentionCallback(): DismissMentionCallback {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [markMentionDismissed] = useMutation<any, MutationMarkMentionDismissedArgs>(
		MARK_MENTION_DISMISSED
	)
	return useCallback(
		async (userId: string, engagementId: string, createdAt: string, dismissAll: boolean) => {
			const result: MessageResponse = { status: StatusType.Failed }

			const resp = await markMentionDismissed({
				variables: {
					userId,
					engagementId,
					createdAt,
					dismissAll
				}
			})
			const markMentionDismissedResp = resp.data.markMentionDismissed as UserResponse
			if (markMentionDismissedResp.status === StatusType.Success) {
				result.status = StatusType.Success
				const dismissedFiltered = markMentionDismissedResp.user?.mentions.filter(
					(m) => !m?.dismissed
				)
				setCurrentUser({ ...currentUser, mentions: dismissedFiltered })
			}

			result.message = markMentionDismissedResp.message
			return result
		},
		[markMentionDismissed, setCurrentUser, currentUser]
	)
}
