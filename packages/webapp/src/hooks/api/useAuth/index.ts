/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ChangeUserPasswordResetCallback,
	useChangePasswordCallback
} from './useChangePasswordCallback'
import {
	useValidateResetPasswordCallback,
	ValidateUserPasswordResetCallback
} from './useValidatePasswordResetCallback'
import { ResetPasswordCallback, useResetPasswordCallback } from './useResetPasswordCallback'
import { BasicAuthCallback, useLoginCallback } from './useLoginCallback'
import { useForgotPasswordCallback, ForgotUserPasswordCallback } from './useForgotPasswordCallback'
import { LogoutCallback, useLogoutCallback } from './useLogoutCallback'
import { useMemo } from 'react'

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	forgotPassword: ForgotUserPasswordCallback
	validateResetPassword: ValidateUserPasswordResetCallback
	changePassword: ChangeUserPasswordResetCallback
} {
	const login = useLoginCallback()
	const logout = useLogoutCallback()
	const resetPassword = useResetPasswordCallback()
	const forgotPassword = useForgotPasswordCallback()
	const validateResetPassword = useValidateResetPasswordCallback()
	const changePassword = useChangePasswordCallback()
	return useMemo(
		() => ({
			login,
			logout,
			resetPassword,
			forgotPassword,
			validateResetPassword,
			changePassword
		}),
		[login, logout, resetPassword, forgotPassword, validateResetPassword, changePassword]
	)
}
