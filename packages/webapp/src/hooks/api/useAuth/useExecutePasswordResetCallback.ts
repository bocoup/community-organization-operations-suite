/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	MutationExecutePasswordResetArgs,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

const EXECUTE_PASSWORD_RESET = gql`
	mutation executePasswordReset($resetToken: String!, $newPassword: String!) {
		executePasswordReset(resetToken: $resetToken, newPassword: $newPassword) {
			message
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
			return handleGraphqlResponse(
				executePasswordReset({ variables: { resetToken, newPassword } }),
				{
					onSuccess: ({ executePasswordReset }: { executePasswordReset: VoidResponse }) => {
						return executePasswordReset.message
					},
					onError: ({ executePasswordReset }: { executePasswordReset: VoidResponse }) => {
						return executePasswordReset.message
					}
				}
			)
		},
		[executePasswordReset]
	)
}
