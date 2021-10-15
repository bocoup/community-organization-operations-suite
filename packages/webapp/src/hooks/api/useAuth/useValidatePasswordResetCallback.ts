/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { VoidResponse, StatusType } from '@cbosuite/schema/dist/client-types'
import { createLogger } from '~utils/createLogger'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const VALIDATE_RESET_PASSWORD_TOKEN = gql`
	mutation validateResetUserPasswordToken($body: ValidateResetUserPasswordTokenInput!) {
		validateResetUserPasswordToken(body: $body) {
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
	const [validateResetPasswordToken] = useMutation(VALIDATE_RESET_PASSWORD_TOKEN)
	return useCallback(
		async (email: string, resetToken: string) => {
			const result: MessageResponse = { status: StatusType.Failed }
			try {
				const resp = await validateResetPasswordToken({
					variables: { body: { email, resetToken } }
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
