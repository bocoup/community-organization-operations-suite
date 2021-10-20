/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	VoidResponse,
	StatusType,
	MutationValidateResetUserPasswordTokenArgs
} from '@cbosuite/schema/dist/client-types'
import { createLogger } from '~utils/createLogger'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const VALIDATE_RESET_PASSWORD_TOKEN = gql`
	mutation validateResetUserPasswordToken($email: String!, $resetToken: String!) {
		validateResetUserPasswordToken(email: $email, resetToken: $resetToken) {
			message
			status
		}
	}
`

export type ValidateUserPasswordResetCallback = (
	email: string,
	resetToken: string
) => Promise<MessageResponse>

export function useValidateResetPasswordCallback(): ValidateUserPasswordResetCallback {
	const [validateResetPasswordToken] = useMutation<any, MutationValidateResetUserPasswordTokenArgs>(
		VALIDATE_RESET_PASSWORD_TOKEN
	)
	return useCallback(
		async (email: string, resetToken: string) => {
			const result: MessageResponse = { status: StatusType.Failed }
			try {
				const resp = await validateResetPasswordToken({
					variables: { email, resetToken }
				})
				const validateResetPasswordTokenResp = resp.data
					.validateResetUserPasswordToken as VoidResponse
				if (validateResetPasswordTokenResp?.status === StatusType.Success) {
					result.status = StatusType.Success
				}

				result.message = validateResetPasswordTokenResp?.message
			} catch (error) {
				logger('Error validating reset token', error)
				result.message = error?.message
			}

			return result
		},
		[validateResetPasswordToken]
	)
}
