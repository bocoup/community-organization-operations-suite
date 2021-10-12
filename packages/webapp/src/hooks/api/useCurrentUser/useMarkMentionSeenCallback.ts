/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { StatusType, User, UserResponse } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { MessageResponse } from '../types'
import { MentionFields } from '../fragments'

const MARK_MENTION_SEEN = gql`
	${MentionFields}

	mutation markMentionSeen($body: MentionUserInput!) {
		markMentionSeen(body: $body) {
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

export type MarkMentionSeenCallback = (
	userId: string,
	engagementId: string,
	createdAt: string,
	markAll: boolean
) => Promise<MessageResponse>

export function useMarkMentionSeenCallback(): MarkMentionSeenCallback {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)

	return useCallback(
		async (userId: string, engId: string, createdAt: string, markAll: boolean) => {
			const result: MessageResponse = { status: StatusType.Failed }

			const resp = await markMentionSeen({
				variables: { body: { userId, engId, createdAt, markAll } }
			})
			const markMentionSeenResp = resp.data.markMentionSeen as UserResponse
			if (markMentionSeenResp.status === StatusType.Success) {
				result.status = StatusType.Success
				setCurrentUser({ ...currentUser, mentions: markMentionSeenResp.user.mentions })
			}

			result.message = markMentionSeenResp.message
			return result
		},
		[markMentionSeen, currentUser, setCurrentUser]
	)
}
