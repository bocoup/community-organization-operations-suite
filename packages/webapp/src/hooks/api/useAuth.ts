/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	AuthenticationResponse,
	User,
	UserActionResponse
} from '@greenlight/schema/lib/client-types'
import { useRecoilState } from 'recoil'
import { userAuthState, currentUserState } from '~store'
import { CurrentUserFields } from './fragments'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($username: String!, $password: String!) {
		authenticate(username: $username, password: $password) {
			accessToken
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

const RESET_USER_PASSWORD = gql`
	${CurrentUserFields}

	mutation resetUserPassword($userId: String!) {
		resetUserPassword(id: $userId) {
			user {
				...CurrentUserFields
			}
			message
			status
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

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	authUser: AuthenticationResponse
	currentUserId: string
} {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	const login = async (username: string, password: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await authenticate({ variables: { username, password } })
			const authResp = resp.data?.authenticate as AuthenticationResponse
			if (authResp?.status === 'SUCCESS') {
				result.status = 'success'
				// Set the local store variables
				setUserAuth(authResp)
				setCurrentUser(authResp.user)
			}

			result.message = authResp.message

			// No success message only login
		} catch (error) {
			result.message = error
			failure(c('hooks.useAuth.login.failed'), error)
		}

		return result
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

		try {
			const resp = await resetUserPassword({ variables: { userId } })
			const resetUserPasswordResp = resp.data.resetUserPassword as UserActionResponse
			if (resetUserPasswordResp?.status === 'SUCCESS') {
				result.status = 'success'
				success(c('hooks.useAuth.reset.success'))
			}

			result.message = resetUserPasswordResp.message
		} catch (error) {
			result.message = error
			failure(c('hooks.useAuth.reset.failed'), error)
		}

		return result
	}

	return {
		login,
		logout,
		resetPassword,
		authUser,
		currentUserId: authUser?.user?.id
	}
}
