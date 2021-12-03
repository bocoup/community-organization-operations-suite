/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	MutationMarkMentionDismissedArgs,
	User,
	UserResponse
} from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { MessageResponse } from '../types'
import { MentionFields } from '../fragments'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

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
			return handleGraphqlResponse(
				markMentionDismissed({
					variables: {
						userId,
						engagementId,
						createdAt,
						dismissAll
					}
				}),
				{
					onSuccess: ({ markMentionDismissed }: { markMentionDismissed: UserResponse }) => {
						const dismissedFiltered = markMentionDismissed.user?.mentions.filter(
							(m) => !m?.dismissed
						)
						setCurrentUser({ ...currentUser, mentions: dismissedFiltered })
						return markMentionDismissed.message
					}
				}
			)
		},
		[markMentionDismissed, setCurrentUser, currentUser]
	)
}
