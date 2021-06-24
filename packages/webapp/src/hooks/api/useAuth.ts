/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userAuthState, currentUserState } from '~store'
import { CurrentUserFields } from './fragments'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($username: String!, $password: String!) {
		authenticate(username: $username, password: $password) {
			message
			accessToken
			user {
				...CurrentUserFields
			}
		}
	}
`

const RESET_USER_PASSWORD = gql`
	mutation resetUserPassword($userId: String!) {
		resetUserPassword(id: $userId) {
			user {
				id
				userName
				name {
					first
					middle
					last
				}
				roles {
					orgId
					roleType
				}
				email
				phone
			}
			message
		}
	}
`

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

export type BasicAuthCallback = (
	username: string,
	password: string
) => Promise<{ status: string; message?: string }>
export type LogoutCallback = () => void
export type ResetPasswordCallback = (
	userId: string
) => Promise<{ status: string; message?: string }>

export type MarkMentionSeen = (
	userId: string,
	engagementId: string
) => Promise<{ status: string; message?: string }>

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	markMention: MarkMentionSeen
	authUser: AuthenticationResponse
	currentUserId: string
} {
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [markMentionSeen] = useMutation(MARK_MENTION_SEEN)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [curentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	// Check user permssion here if a user is currently logged in
	useEffect(() => {
		if (authUser) {
			// Check if user is logged in (create a useQuery for this)
			// Log user out if auth check fails
			//console.log('authUser', authUser)
		}
	}, [authUser])

	const login = async (username: string, password: string) => {
		try {
			const result = {
				status: 'failed',
				message: null
			}

			const resp = await authenticate({ variables: { username, password } })
			setUserAuth(resp.data.authenticate)
			setCurrentUser(resp.data.authenticate.user)
			if (resp.data.authenticate.message.toLowerCase() === 'auth success') {
				result.status = 'success'
			}

			result.message = resp.data.authenticate.message

			return result
		} catch (error) {
			// TODO: handle error: 404, 500, etc..
			console.log('error', error)
		}
	}

	const logout = () => {
		setUserAuth(null)
		setCurrentUser(null)
	}

	const resetPassword = async (userId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await resetUserPassword({ variables: { userId } })

		if (resp.data.resetUserPassword.message.toLowerCase() === 'success') {
			result.status = 'success'
		}

		result.message = resp.data.resetUserPassword.message
		return result
	}

	const markMention = async (userId: string, engagementId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await markMentionSeen({ variables: { userId, engagementId } })

		if (resp.data.markMentionSeen.message.toLowerCase() === 'success') {
			result.status = 'success'
			setCurrentUser({ ...curentUser, mentions: resp.data.markMentionSeen.user.mentions })
		}

		result.message = resp.data.markMentionSeen.message
		return result
	}

	return {
		login,
		logout,
		resetPassword,
		markMention,
		authUser,
		currentUserId: authUser?.user?.id
	}
}
