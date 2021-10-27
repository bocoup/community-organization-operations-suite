/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationSetUserPasswordArgs } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { UserFields } from '../fragments'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

const SET_USER_PASSWORD = gql`
	${UserFields}

	mutation setUserPassword($oldPassword: String!, $newPassword: String!) {
		setUserPassword(oldPassword: $oldPassword, newPassword: $newPassword) {
			user {
				...UserFields
			}
			message
		}
	}
`

export type SetPasswordCallback = (
	oldPassword: string,
	newPassword: string
) => Promise<MessageResponse>

export function useSetPasswordCallback(): SetPasswordCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [setUserPassword] = useMutation<any, MutationSetUserPasswordArgs>(SET_USER_PASSWORD)

	return useCallback(
		async (oldPassword: string, newPassword: string) => {
			return handleGraphqlResponse(setUserPassword({ variables: { oldPassword, newPassword } }), {
				toast,
				successToast: c('hooks.useProfile.setPassword.success'),
				failureToast: c('hooks.useProfile.setPassword.failed')
			})
		},
		[c, toast, setUserPassword]
	)
}
