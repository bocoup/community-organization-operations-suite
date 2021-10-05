/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { StatusType, UserActionResponse } from '@cbosuite/schema/dist/client-types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '.'
import { UserFields } from './fragments'

const SET_USER_PASSWORD = gql`
	${UserFields}

	mutation setUserPassword($body: PasswordChangeInput!) {
		setUserPassword(body: $body) {
			user {
				...UserFields
			}
			message
			status
		}
	}
`

export type SetPasswordCallback = (
	oldPassword: string,
	newPassword: string
) => Promise<MessageResponse>

export function useProfile(): {
	setPassword: SetPasswordCallback
} {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [setUserPassword] = useMutation(SET_USER_PASSWORD)

	const setPassword = async (oldPassword: string, newPassword: string) => {
		const result: MessageResponse = { status: StatusType.Failed }

		try {
			const resp = await setUserPassword({ variables: { body: { oldPassword, newPassword } } })
			const setUserPasswordResp = resp.data.setUserPassword as UserActionResponse

			if (setUserPasswordResp.status === StatusType.Success) {
				result.status = StatusType.Success
				success(c('hooks.useProfile.setPassword.success'))
			}

			result.message = setUserPasswordResp.message
		} catch (error) {
			result.message = error
			failure(c('hooks.useProfile.setPassword.failed'), error)
		}

		return result
	}

	return {
		setPassword
	}
}
