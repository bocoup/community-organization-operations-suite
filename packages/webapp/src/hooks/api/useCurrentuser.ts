/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { User } from '@greenlight/schema/lib/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'

const MARK_MENTION_SEEN = gql`
	mutation markMentionSeen($userId: String!, $engagementId: String!) {
		markMentionSeen(userId: $userId, engagementId: $engagementId) {
			user {
				mentions {
					engagementId
					createdAt
					seen
				}
			}
			message
		}
	}
`

export type MarkMentionSeen = (
	userId: string,
	engagementId: string
) => Promise<{ status: string; message?: string }>

export function useCurrentUser(): {
	currentUser: User
	markMention: MarkMentionSeen
} {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)

	const markMention = async (userId: string, engagementId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await markMentionSeen({ variables: { userId, engagementId } })

		if (resp.data.markMentionSeen.message.toLowerCase() === 'success') {
			result.status = 'success'
			setCurrentUser({ ...currentUser, mentions: resp.data.markMentionSeen.user.mentions })
		}

		result.message = resp.data.markMentionSeen.message
		return result
	}

	return {
		markMention,
		currentUser
	}
}
