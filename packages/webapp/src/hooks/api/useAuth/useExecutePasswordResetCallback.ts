/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	VoidResponse,
	StatusType,
	MutationExecutePasswordResetArgs
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'

const logger = createLogger('useAuth')
const EXECUTE_PASSWORD_RESET = gql`
	mutation executePasswordReset($resetToken: String!, $newPassword: String!) {
		executePasswordReset(resetToken: $resetToken, newPassword: $newPassword) {
			message
			status
		}
	}
`

export type ExecutePasswwordResetCallback = (
	resetToken: string,
	newPassword: string
) => Promise<MessageResponse>

export function useExecutePasswordResetCallback(): ExecutePasswwordResetCallback {
	const [executePasswordReset] = useMutation<any, MutationExecutePasswordResetArgs>(
		EXECUTE_PASSWORD_RESET
	)
	return useCallback(
		async (resetToken: string, newPassword: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await executePasswordReset({ variables: { resetToken, newPassword } })
				const executePasswordResetResp = resp.data.executePasswordReset as VoidResponse
				if (executePasswordResetResp?.status === StatusType.Success) {
					result.status = StatusType.Success
				}

				result.message = executePasswordResetResp?.message
			} catch (error) {
				logger('Error reseting user password', error)
				result.message = error?.message
			}

			return result
		},
		[executePasswordReset]
	)
}
