/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import type {
	User,
	UserResponse
} from '@community-organization-operations-suite/schema/lib/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { MentionFields, CurrentUserFields } from './fragments'

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

const MARK_MENTION_DISMISSED = gql`
	${MentionFields}

	mutation markMentionDismissed($body: MentionUserInput!) {
		markMentionDismissed(body: $body) {
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

const GET_CURRENT_USER = gql`
	${CurrentUserFields}

	query user($body: UserIdInput!) {
		user(body: $body) {
			...CurrentUserFields
		}
	}
`

export type MarkMentionSeen = (
	userId: string,
	engagementId: string,
	createdAt: string,
	markAll: boolean
) => Promise<{ status: string; message?: string }>

export type MarkMentionDismissed = (
	userId: string,
	engagementId: string,
	createdAt: string,
	dismissAll: boolean
) => Promise<{ status: string; message?: string }>

export function useCurrentUser(): {
	currentUser: User
	userId: string
	role: string
	orgId: string
	loading: boolean
	error: any
	loadCurrentUser: (userId: string) => void
	markMention: MarkMentionSeen
	dismissMention: MarkMentionDismissed
} {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)
	const [markMentionDismissed] = useMutation(MARK_MENTION_DISMISSED)

	const [load, { loading, error }] = useLazyQuery(GET_CURRENT_USER, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.user) {
				setCurrentUser(data.user)
			}
		},
		onError: error => {
			if (error) {
				console.error('Error loading data', error)
			}
		}
	})

	const markMention = async (
		userId: string,
		engId: string,
		createdAt: string,
		markAll: boolean
	) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await markMentionSeen({
			variables: { body: { userId, engId, createdAt, markAll } }
		})
		const markMentionSeenResp = resp.data.markMentionSeen as UserResponse
		if (markMentionSeenResp.status === 'SUCCESS') {
			result.status = 'success'
			setCurrentUser({ ...currentUser, mentions: markMentionSeenResp.user.mentions })
		}

		result.message = markMentionSeenResp.message
		return result
	}

	const dismissMention = async (
		userId: string,
		engId: string,
		createdAt: string,
		dismissAll: boolean
	) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await markMentionDismissed({
			variables: { body: { userId, engId, createdAt, dismissAll } }
		})
		const markMentionDismissedResp = resp.data.markMentionDismissed as UserResponse
		if (markMentionDismissedResp.status === 'SUCCESS') {
			result.status = 'success'
			const dismissedFiltered = markMentionDismissedResp.user?.mentions.filter(m => !m?.dismissed)
			setCurrentUser({ ...currentUser, mentions: dismissedFiltered })
		}

		result.message = markMentionDismissedResp.message
		return result
	}

	const filteredCurrentUser = {
		...currentUser,
		mentions: currentUser?.mentions.filter(m => !m.dismissed)
	}

	const loadCurrentUser = userId => {
		load({ variables: { body: { userId } } })
	}

	return {
		markMention,
		dismissMention,
		loadCurrentUser,
		loading,
		error,
		currentUser: filteredCurrentUser,
		userId: currentUser?.id,
		role: currentUser?.roles[0].roleType || '',
		orgId: currentUser?.roles[0].orgId || ''
	}
}
