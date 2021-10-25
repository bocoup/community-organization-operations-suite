/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	VoidResponse,
	StatusType,
	MutationInitiatePasswordResetArgs
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const INITIATE_PASSWORD_RESET = gql`
	mutation initiatePasswordReset($email: String!) {
		initiatePasswordReset(email: $email) {
			message
			status
		}
	}
`

export type InitiatePasswordResetCallback = (email: string) => Promise<MessageResponse>

export function useInitiatePasswordResetCallback(): InitiatePasswordResetCallback {
	const [initiatePasswordReset] = useMutation<any, MutationInitiatePasswordResetArgs>(
		INITIATE_PASSWORD_RESET
	)
	return useCallback(
		async (email: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await initiatePasswordReset({ variables: { email } })
				const initiatePasswordResetResp = resp.data.initiatePasswordReset as VoidResponse
				if (initiatePasswordResetResp?.status === StatusType.Success) {
					result.status = StatusType.Success
				}

				result.message = initiatePasswordResetResp?.message
			} catch (error) {
				logger('Error reseting user password', error)
				result.message = error?.message
			}

			return result
		},
		[initiatePasswordReset]
	)
}
