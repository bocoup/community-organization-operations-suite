/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	AuthenticationResponse,
	MutationAuthenticateArgs,
	User
} from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { storeAccessToken } from '~utils/localStorage'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($username: String!, $password: String!) {
		authenticate(username: $username, password: $password) {
			accessToken
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

export type BasicAuthCallback = (username: string, password: string) => Promise<MessageResponse>

export function useLoginCallback(): BasicAuthCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [authenticate] = useMutation<any, MutationAuthenticateArgs>(AUTHENTICATE_USER)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	return useCallback(
		async (username: string, password: string) => {
			return handleGraphqlResponse(authenticate({ variables: { username, password } }), {
				toast,
				failureToast: c('hooks.useAuth.loginFailed'),
				onSuccess: ({ authenticate }: { authenticate: AuthenticationResponse }) => {
					storeAccessToken(authenticate.accessToken)
					setCurrentUser(authenticate.user)
					return authenticate.message
				}
			})
		},
		[c, toast, authenticate, setCurrentUser]
	)
}
