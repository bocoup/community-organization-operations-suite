/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ExecutePasswwordResetCallback } from './useExecutePasswordResetCallback'
import { useExecutePasswordResetCallback } from './useExecutePasswordResetCallback'
import type { ResetPasswordCallback } from './useResetPasswordCallback'
import { useResetPasswordCallback } from './useResetPasswordCallback'
import type { BasicAuthCallback } from './useLoginCallback'
import { useLoginCallback } from './useLoginCallback'
import type { InitiatePasswordResetCallback } from './useInitiatePasswordResetCallback'
import { useInitiatePasswordResetCallback } from './useInitiatePasswordResetCallback'
import type { LogoutCallback } from './useLogoutCallback'
import { useLogoutCallback } from './useLogoutCallback'
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
