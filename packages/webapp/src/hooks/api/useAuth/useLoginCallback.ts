/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	AuthenticationResponse,
	MutationAuthenticateArgs,
	User
} from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useOffline } from '~hooks/useOffline'
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { storeAccessToken } from '~utils/localStorage'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'
import { StatusType } from '~hooks/api'
import { setUser, setAccessToken } from '~utils/localCrypto'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($username: String!, $password: String!) {
		authenticate(username: $username, password: $password) {
			accessToken
			user {
				...CurrentUserFields
			}
			message
		}
	}
`

export type BasicAuthCallback = (username: string, password: string) => Promise<MessageResponse>

export function useLoginCallback(): BasicAuthCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const isOffline = useOffline()
	const [authenticate] = useMutation<any, MutationAuthenticateArgs>(AUTHENTICATE_USER)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	return useCallback(
		async (username: string, password: string) => {
			if (isOffline) {
				return Promise.resolve({
					status: StatusType.Failed,
					message: 'Application is offline, cannot authenticate'
				})
			}
			return handleGraphqlResponse(authenticate({ variables: { username, password } }), {
				toast,
				failureToast: c('hooks.useAuth.loginFailed'),
				onSuccess: ({ authenticate }: { authenticate: AuthenticationResponse }) => {
					storeAccessToken(authenticate.accessToken)
					setCurrentUser(authenticate.user)
					setUser(username, authenticate.user)
					setAccessToken(username, authenticate.accessToken)
					return authenticate.message
				}
			})
		},
		[c, toast, authenticate, setCurrentUser, isOffline]
	)
}
