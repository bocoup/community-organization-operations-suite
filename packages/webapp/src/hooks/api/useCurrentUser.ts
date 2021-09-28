/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { RoleType, User, UserResponse } from '@cbosuite/schema/dist/client-types'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentUserState, organizationState } from '~store'
import { createLogger } from '~utils/createLogger'
import { MentionFields, CurrentUserFields } from './fragments'
const logger = createLogger('useCurrentUser')

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

const UPDATE_USER_FCM_TOKEN = gql`
	mutation updateUserFCMToken($body: UserFCMInput!) {
		updateUserFCMToken(body: $body) {
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

export interface useCurrentUserReturn {
	currentUser: User
	userId: string
	role: string
	orgId: string
	loading: boolean
	error: any
	isAdmin: boolean
	loadCurrentUser: (userId: string) => void
	markMention: MarkMentionSeen
	dismissMention: MarkMentionDismissed
	updateFCMToken: (fcmToken: string) => void
}

export function useCurrentUser(): useCurrentUserReturn {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const organization = useRecoilValue(organizationState)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)
	const [updateUserFCMToken] = useMutation(UPDATE_USER_FCM_TOKEN)
	const [markMentionDismissed] = useMutation(MARK_MENTION_DISMISSED)
	const [isAdmin, setIsAdmin] = useState(false)
	const [currentRole, setCurrentRole] = useState<RoleType>(RoleType.User)
	const [orgId, setOrgId] = useState<string>(currentUser?.roles[0].orgId || '')

	const [load, { loading, error }] = useLazyQuery(GET_CURRENT_USER, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			if (data?.user) {
				setCurrentUser(data.user)
			}
		},
		onError: (error) => {
			if (error) {
				logger('Error loading data', error)
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
			const dismissedFiltered = markMentionDismissedResp.user?.mentions.filter((m) => !m?.dismissed)
			setCurrentUser({ ...currentUser, mentions: dismissedFiltered })
		}

		result.message = markMentionDismissedResp.message
		return result
	}

	const filteredCurrentUser = {
		...currentUser,
		mentions: currentUser?.mentions.filter((m) => !m.dismissed)
	}

	const loadCurrentUser: useCurrentUserReturn['loadCurrentUser'] = (userId) => {
		load({ variables: { body: { userId } } })
	}

	const updateFCMToken: useCurrentUserReturn['updateFCMToken'] = async (fcmToken) => {
		await updateUserFCMToken({ variables: { body: { fcmToken } } })
	}

	useEffect(() => {
		setOrgId(organization?.id)
	}, [organization])

	useEffect(() => {
		setIsAdmin(currentUser?.roles.some((r) => r.roleType === RoleType.Admin && r.orgId === orgId))
	}, [orgId, currentUser])

	useEffect(() => {
		setCurrentRole(isAdmin ? RoleType.Admin : RoleType.User)
	}, [setCurrentRole, isAdmin])

	return {
		markMention,
		dismissMention,
		loadCurrentUser,
		updateFCMToken,
		loading,
		error,
		currentUser: filteredCurrentUser,
		userId: currentUser?.id,
		role: currentRole,
		orgId: orgId || '',
		isAdmin: isAdmin
	}
}
