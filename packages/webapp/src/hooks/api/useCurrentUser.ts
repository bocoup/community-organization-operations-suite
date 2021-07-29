/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { User, UserResponse } from '@resolve/schema/lib/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { MentionFields } from './fragments'

const MARK_MENTION_SEEN = gql`
	${MentionFields}

	mutation markMentionSeen($body: EngagementUserInput!) {
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

export type MarkMentionSeen = (
	userId: string,
	engagementId: string
) => Promise<{ status: string; message?: string }>

export function useCurrentUser(): {
	currentUser: User
	userId: string
	role: string
	orgId: string
	markMention: MarkMentionSeen
} {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)

	const markMention = async (userId: string, engId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await markMentionSeen({ variables: { body: { userId, engId } } })
		const markMentionSeenResp = resp.data.markMentionSeen as UserResponse
		if (markMentionSeenResp.status === 'SUCCESS') {
			result.status = 'success'
			setCurrentUser({ ...currentUser, mentions: markMentionSeenResp.user.mentions })
		}

		result.message = markMentionSeenResp.message
		return result
	}

	return {
		markMention,
		currentUser,
		userId: currentUser?.id,
		role: currentUser?.roles[0].roleType || '',
		orgId: currentUser?.roles[0].orgId || ''
	}
}
