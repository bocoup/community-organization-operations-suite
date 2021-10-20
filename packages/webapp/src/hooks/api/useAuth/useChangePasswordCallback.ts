/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	VoidResponse,
	StatusType,
	MutationChangeUserPasswordArgs
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const CHANGE_USER_PASSWORD = gql`
	mutation changeUserPassword($email: String!, $newPassword: String!) {
		changeUserPassword(email: $email, newPassword: $newPassword) {
			message
			status
		}
	}
`

export type ChangeUserPasswordResetCallback = (
	email: string,
	newPassword: string
) => Promise<MessageResponse>

/**
 * Use a password change callback. This is the second step of a password reset.
 * @returns A callback to use for the password change
 */
export function useChangePasswordCallback(): ChangeUserPasswordResetCallback {
	const [changeUserPassword] = useMutation<any, MutationChangeUserPasswordArgs>(
		CHANGE_USER_PASSWORD
	)
	return useCallback(
		async (email: string, newPassword: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await changeUserPassword({ variables: { email, newPassword } })
				const changeUserPasswordResp = resp.data.changeUserPassword as VoidResponse
				if (changeUserPasswordResp?.status === StatusType.Success) {
					result.status = StatusType.Success
				}

				result.message = changeUserPasswordResp?.message
			} catch (error) {
				result.message = error
			}

			return result
		},
		[changeUserPassword]
	)
}
