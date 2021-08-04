/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	AuthenticationResponse,
	ForgotUserPasswordResponse,
	User,
	UserActionResponse
} from '@resolve/schema/lib/client-types'
import { useRecoilState, useResetRecoilState } from 'recoil'
import {
	userAuthState,
	currentUserState,
	organizationState,
	engagementListState,
	myEngagementListState,
	inactiveEngagementListState
} from '~store'
import { CurrentUserFields } from './fragments'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { AuthResponse } from './types'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($body: AuthenticationInput!) {
		authenticate(body: $body) {
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

	mutation resetUserPassword($body: UserIdInput!) {
		resetUserPassword(body: $body) {
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

const FORGOT_USER_PASSWORD = gql`
	mutation forgotUserPassword($body: ForgotUserPasswordInput!) {
		forgotUserPassword(body: $body) {
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
export type ForgotUserPasswordCallback = (
	email: string,
	forgotPasswordToken?: string
) => Promise<{ status: string; message?: string }>

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	forgotPassword: ForgotUserPasswordCallback
	accessToken?: string
} {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [forgotUserPassword] = useMutation(FORGOT_USER_PASSWORD)

	const [authUser, setUserAuth] = useRecoilState<AuthResponse | null>(userAuthState)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	const resetOrg = useResetRecoilState(organizationState)
	const resetEngagement = useResetRecoilState(engagementListState)
	const resetMyEngagement = useResetRecoilState(myEngagementListState)
	const resetInactiveEngagement = useResetRecoilState(inactiveEngagementListState)
	const resetUserAuth = useResetRecoilState(userAuthState)
	const resetCurrentUser = useResetRecoilState(currentUserState)

	const login = async (username: string, password: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await authenticate({ variables: { body: { username, password } } })
			const authResp: AuthenticationResponse | null = resp.data?.authenticate
			if (authResp?.status === 'SUCCESS') {
				result.status = 'success'
				// Set the local store variables
				setUserAuth({
					accessToken: authResp.accessToken,
					message: authResp.message,
					status: authResp.status
				})
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
		resetUserAuth()
		resetCurrentUser()
		resetOrg()
		resetEngagement()
		resetMyEngagement()
		resetInactiveEngagement()
	}

	const resetPassword = async (userId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await resetUserPassword({ variables: { body: { userId } } })
			const resetUserPasswordResp = resp.data.resetUserPassword as UserActionResponse
			if (resetUserPasswordResp?.status === 'SUCCESS') {
				result.status = 'success'
				success(c('hooks.useAuth.reset.success'))
			}

			if (resetUserPasswordResp?.message.startsWith('SUCCESS_NO_MAIL')) {
				// For dev use only
				console.log(resetUserPasswordResp.message)
			}

			result.message = resetUserPasswordResp.message
		} catch (error) {
			result.message = error
			failure(c('hooks.useAuth.reset.failed'), error)
		}

		return result
	}

	const forgotPassword = async (email: string, forgotPasswordToken?: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await forgotUserPassword({ variables: { body: { email, forgotPasswordToken } } })
			const forgotUserPasswordResp = resp.data.forgotUserPassword as ForgotUserPasswordResponse
			if (forgotUserPasswordResp?.status === 'SUCCESS') {
				result.status = 'success'
			}

			result.message = forgotUserPasswordResp?.message
		} catch (error) {
			result.message = error
		}

		return result
	}

	return {
		login,
		logout,
		resetPassword,
		forgotPassword,
		accessToken: authUser?.accessToken
	}
}
