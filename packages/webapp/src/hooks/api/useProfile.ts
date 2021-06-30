/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import useToasts from '~hooks/useToasts'

const SET_USER_PASSWORD = gql`
	mutation setUserPassword($oldPassword: String!, $newPassword: String!) {
		setUserPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
			user {
				id
				userName
				name {
					first
					middle
					last
				}
				roles {
					orgId
					roleType
				}
				email
				phone
			}
			message
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
	const { success, failure } = useToasts()
	const [setUserPassword] = useMutation(SET_USER_PASSWORD)

	const setPassword = async (oldPassword: string, newPassword: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
		const resp = await setUserPassword({ variables: { oldPassword, newPassword } })

			if (resp.data.setUserPassword.message.toLowerCase() === 'success') {
				result.status = 'success'
				success('Password set')
			}

			result.message = resp.data.setUserPassword.message
		} catch (error) {
			result.message = error
			failure('Failed to set new password', error)
		}

		return result
	}

	return {
		setPassword
	}
}
