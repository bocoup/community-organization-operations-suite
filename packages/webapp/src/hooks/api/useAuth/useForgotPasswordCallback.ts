/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ForgotUserPasswordResponse, StatusType } from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const FORGOT_USER_PASSWORD = gql`
	mutation forgotUserPassword($body: ForgotUserPasswordInput!) {
		forgotUserPassword(body: $body) {
			message
			status
		}
	}
`

export type ForgotUserPasswordCallback = (email: string) => Promise<MessageResponse>

export function useForgotPasswordCallback(): ForgotUserPasswordCallback {
	const [forgotUserPassword] = useMutation(FORGOT_USER_PASSWORD)
	return useCallback(
		async (email: string) => {
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
		},
		[forgotUserPassword]
	)
}
