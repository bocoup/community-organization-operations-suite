/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	MutationMarkMentionSeenArgs,
	User,
	UserResponse
} from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import type { MessageResponse } from '../types'
import { MentionFields } from '../fragments'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

const MARK_MENTION_SEEN = gql`
	${MentionFields}

	mutation markMentionSeen(
		$userId: String!
		$markAll: Boolean
		$engagementId: String
		$createdAt: String
	) {
		markMentionSeen(
			userId: $userId
			markAll: $markAll
			engagementId: $engagementId
			createdAt: $createdAt
		) {
			user {
				mentions {
					...MentionFields
				}
			}
			message
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
	const [markMentionSeen] = useMutation<any, MutationMarkMentionSeenArgs>(MARK_MENTION_SEEN)

	return useCallback(
		async (userId: string, engagementId: string, createdAt: string, markAll: boolean) => {
			return handleGraphqlResponse(
				markMentionSeen({
					variables: { userId, engagementId, createdAt, markAll }
				}),
				{
					onSuccess: ({ markMentionSeen }: { markMentionSeen: UserResponse }) => {
						setCurrentUser({ ...currentUser, mentions: markMentionSeen.user.mentions })
						return markMentionSeen.message
					}
				}
			)
		},
		[markMentionSeen, currentUser, setCurrentUser]
	)
}
