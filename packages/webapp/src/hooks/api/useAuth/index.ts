/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	useExecutePasswordResetCallback,
	ExecutePasswwordResetCallback
} from './useExecutePasswordResetCallback'
import { ResetPasswordCallback, useResetPasswordCallback } from './useResetPasswordCallback'
import { BasicAuthCallback, useLoginCallback } from './useLoginCallback'
import {
	useInitiatePasswordResetCallback,
	InitiatePasswordResetCallback
} from './useInitiatePasswordResetCallback'
import { LogoutCallback, useLogoutCallback } from './useLogoutCallback'
import { useMemo } from 'react'

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetSpecialistPassword: ResetPasswordCallback
	initiatePasswordReset: InitiatePasswordResetCallback
	executePasswordReset: ExecutePasswwordResetCallback
} {
	const login = useLoginCallback()
	const logout = useLogoutCallback()
	const resetSpecialistPassword = useResetPasswordCallback()
	const initiatePasswordReset = useInitiatePasswordResetCallback()
	const executePasswordReset = useExecutePasswordResetCallback()
	return useMemo(
		() => ({
			login,
			logout,
			initiatePasswordReset,
			executePasswordReset,
			resetSpecialistPassword
		}),
		[login, logout, initiatePasswordReset, executePasswordReset, resetSpecialistPassword]
	)
}
