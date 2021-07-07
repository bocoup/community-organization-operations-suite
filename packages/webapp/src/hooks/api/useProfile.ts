/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { UserActionResponse } from '@greenlight/schema/lib/client-types'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { UserFields } from './fragments'

const SET_USER_PASSWORD = gql`
	${UserFields}

	mutation setUserPassword($oldPassword: String!, $newPassword: String!) {
		setUserPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
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
) => Promise<{ status: string; message?: string }>

export function useProfile(): {
	setPassword: SetPasswordCallback
} {
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()
	const [setUserPassword] = useMutation(SET_USER_PASSWORD)

	const setPassword = async (oldPassword: string, newPassword: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await setUserPassword({ variables: { oldPassword, newPassword } })
			const setUserPasswordResp = resp.data.setUserPassword as UserActionResponse

			if (setUserPasswordResp.status === 'SUCCESS') {
				result.status = 'success'
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
