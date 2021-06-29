/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { useRecoilState } from 'recoil'
import { userAuthState, currentUserState } from '~store'
import { CurrentUserFields } from './fragments'
import useToasts from '~hooks/useToasts'

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

export type BasicAuthCallback = (
	username: string,
	password: string
) => Promise<{ status: string; message?: string }>
export type LogoutCallback = () => void

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: (userId: string) => void
	authUser: AuthenticationResponse
	currentUserId: string
} {
	const { success, failure } = useToasts()
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	const login = async (username: string, password: string) => {
		try {
			const result = {
				status: 'failed',
				message: null
			}

			const resp = await authenticate({ variables: { username, password } })

			if (resp.data.authenticate.message.toLowerCase() === 'auth success') {
				result.status = 'success'
				// Set the local store variables
				setUserAuth(resp.data.authenticate)
				setCurrentUser(resp.data.authenticate.user)
			} else {
				throw new Error('Auth failed')
			}

			result.message = resp.data.authenticate.message

			return result
		} catch (error) {
			failure('Failed to login', error)
		}
	}

	const logout = () => {
		setUserAuth(null)
		setCurrentUser(null)
	}

	const resetPassword = async (userId: string) => {
		try {
			await resetUserPassword({ variables: { userId } })

			success('Reset use password email sent')
		} catch (error) {
			failure('Failed to send reset user password email', error)
		}
	}

	return {
		login,
		logout,
		resetPassword,
		authUser,
		currentUserId: authUser?.user?.id
	}
}
