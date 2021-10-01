/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	AuthenticationResponse,
	ForgotUserPasswordResponse,
	StatusType,
	User,
	UserActionResponse
} from '@cbosuite/schema/dist/client-types'
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
import { createLogger } from '~utils/createLogger'
import { MessageResponse } from '.'
const logger = createLogger('useAuth')

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

const VALIDATE_RESET_PASSWORD_TOKEN = gql`
	mutation validateResetUserPasswordToken($body: ValidateResetUserPasswordTokenInput!) {
		validateResetUserPasswordToken(body: $body) {
			message
			status
		}
	}
`

const CHANGE_USER_PASSWORD = gql`
	mutation changeUserPassword($body: ChangeUserPasswordInput!) {
		changeUserPassword(body: $body) {
			message
			status
		}
	}
`

export type BasicAuthCallback = (username: string, password: string) => Promise<MessageResponse>

export type LogoutCallback = () => void

export type ResetPasswordCallback = (userId: string) => Promise<MessageResponse>

export type ForgotUserPasswordCallback = (email: string) => Promise<MessageResponse>

export type ValidateUserPasswordResetCallback = (
	email: string,
	resetToken: string
) => Promise<MessageResponse>

export type ChangeUserPasswordResetCallback = (
	email: string,
	newPassword: string
) => Promise<MessageResponse>

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	forgotPassword: ForgotUserPasswordCallback
	validateResetPassword: ValidateUserPasswordResetCallback
	changePassword: ChangeUserPasswordResetCallback
	accessToken?: string
} {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [forgotUserPassword] = useMutation(FORGOT_USER_PASSWORD)
	const [validateResetPasswordToken] = useMutation(VALIDATE_RESET_PASSWORD_TOKEN)
	const [changeUserPassword] = useMutation(CHANGE_USER_PASSWORD)

	const [authUser, setUserAuth] = useRecoilState<AuthResponse | null>(userAuthState)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	const resetOrg = useResetRecoilState(organizationState)
	const resetEngagement = useResetRecoilState(engagementListState)
	const resetMyEngagement = useResetRecoilState(myEngagementListState)
	const resetInactiveEngagement = useResetRecoilState(inactiveEngagementListState)
	const resetUserAuth = useResetRecoilState(userAuthState)
	const resetCurrentUser = useResetRecoilState(currentUserState)

	const login = async (username: string, password: string) => {
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await authenticate({ variables: { body: { username, password } } })
			const authResp: AuthenticationResponse | null = resp.data?.authenticate
			if (authResp?.status === StatusType.Success) {
				result.status = StatusType.Success
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
			failure(c('hooks.useAuth.loginFailed'), error)
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
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await resetUserPassword({ variables: { body: { userId } } })
			const resetUserPasswordResp = resp.data.resetUserPassword as UserActionResponse
			if (resetUserPasswordResp?.status === StatusType.Success) {
				result.status = StatusType.Success
				success(c('hooks.useAuth.resetSuccess'))
			}

			if (resetUserPasswordResp?.message.startsWith('SUCCESS_NO_MAIL')) {
				// For dev use only
				logger(resetUserPasswordResp.message)
			}

			result.message = resetUserPasswordResp.message
		} catch (error) {
			logger('Error reseting user password.', error)
			result.message = error?.message
			failure(c('hooks.useAuth.reset.failed'), error)
		}

		return result
	}

	const forgotPassword = async (email: string) => {
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await forgotUserPassword({ variables: { body: { email } } })
			const forgotUserPasswordResp = resp.data.forgotUserPassword as ForgotUserPasswordResponse
			if (forgotUserPasswordResp?.status === StatusType.Success) {
				result.status = StatusType.Success
			}

			result.message = forgotUserPasswordResp?.message
		} catch (error) {
			logger('Error reseting user password', error)
			result.message = error?.message
		}

		return result
	}

	const validateResetPassword = async (email: string, resetToken: string) => {
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await validateResetPasswordToken({ variables: { body: { email, resetToken } } })
			const validateResetPasswordTokenResp = resp.data
				.validateResetUserPasswordToken as ForgotUserPasswordResponse
			if (validateResetPasswordTokenResp?.status === StatusType.Success) {
				result.status = StatusType.Success
			}

			result.message = validateResetPasswordTokenResp?.message
		} catch (error) {
			logger('Error validating reset token', error)
			result.message = error?.message
		}

		return result
	}

	// changePassword is a unauthenticated endpoint and is differennt from resetPassword
	const changePassword = async (email: string, newPassword: string) => {
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await changeUserPassword({ variables: { body: { email, newPassword } } })
			const changeUserPasswordResp = resp.data.changeUserPassword as ForgotUserPasswordResponse
			if (changeUserPasswordResp?.status === StatusType.Success) {
				result.status = StatusType.Success
			}

			result.message = changeUserPasswordResp?.message
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
		validateResetPassword,
		changePassword,
		accessToken: authUser?.accessToken
	}
}
