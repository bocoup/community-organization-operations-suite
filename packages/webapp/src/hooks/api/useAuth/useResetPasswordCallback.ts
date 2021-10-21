/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	MutationResetUserPasswordArgs,
	StatusType,
	UserResponse
} from '@cbosuite/schema/dist/client-types'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
const logger = createLogger('useAuth')

const RESET_USER_PASSWORD = gql`
	${CurrentUserFields}

	mutation resetUserPassword($userId: String!) {
		resetUserPassword(userId: $userId) {
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

export type ResetPasswordCallback = (userId: string) => Promise<MessageResponse>

export function useResetPasswordCallback(): ResetPasswordCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [resetUserPassword] = useMutation<any, MutationResetUserPasswordArgs>(RESET_USER_PASSWORD)

	return useCallback(
		async (userId: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await resetUserPassword({ variables: { userId } })
				const resetUserPasswordResp = resp.data.resetUserPassword as UserResponse
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
		},
		[c, failure, resetUserPassword, success]
	)
}
