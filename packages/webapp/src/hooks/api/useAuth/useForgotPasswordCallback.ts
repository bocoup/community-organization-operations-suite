/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	VoidResponse,
	StatusType,
	MutationForgotUserPasswordArgs
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const FORGOT_USER_PASSWORD = gql`
	mutation forgotUserPassword($email: String!) {
		forgotUserPassword(email: $email) {
			message
			status
		}
	}
`

export type ForgotUserPasswordCallback = (email: string) => Promise<MessageResponse>

export function useForgotPasswordCallback(): ForgotUserPasswordCallback {
	const [forgotUserPassword] = useMutation<any, MutationForgotUserPasswordArgs>(
		FORGOT_USER_PASSWORD
	)
	return useCallback(
		async (email: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await forgotUserPassword({ variables: { email } })
				const forgotUserPasswordResp = resp.data.forgotUserPassword as VoidResponse
				if (forgotUserPasswordResp?.status === StatusType.Success) {
					result.status = StatusType.Success
				}

				result.message = forgotUserPasswordResp?.message
			} catch (error) {
				logger('Error reseting user password', error)
				result.message = error?.message
			}

			return result
		},
		[forgotUserPassword]
	)
}
