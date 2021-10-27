/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationResetUserPasswordArgs, UserResponse } from '@cbosuite/schema/dist/client-types'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'
const logger = createLogger('useAuth')

const RESET_USER_PASSWORD = gql`
	${CurrentUserFields}

	mutation resetUserPassword($userId: String!) {
		resetUserPassword(userId: $userId) {
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

export type ResetPasswordCallback = (userId: string) => Promise<MessageResponse>

export function useResetPasswordCallback(): ResetPasswordCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [resetUserPassword] = useMutation<any, MutationResetUserPasswordArgs>(RESET_USER_PASSWORD)

	return useCallback(
		async (userId: string) => {
			return handleGraphqlResponse(resetUserPassword({ variables: { userId } }), {
				toast,
				successToast: c('hooks.useAuth.resetSuccess'),
				failureToast: c('hooks.useAuth.reset.failed'),
				onSuccess: ({ resetUserPassword }: { resetUserPassword: UserResponse }) => {
					// For local dev use only
					if (resetUserPassword.message.startsWith('SUCCESS_NO_MAIL')) {
						logger(resetUserPassword.message)
					}
					return resetUserPassword.message
				}
			})
		},
		[c, toast, resetUserPassword]
	)
}
