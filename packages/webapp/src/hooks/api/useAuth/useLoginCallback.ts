/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	AuthenticationResponse,
	MutationAuthenticateArgs,
	StatusType,
	User
} from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'
import { storeAccessToken } from '~utils/localStorage'
const logger = createLogger('useAuth')

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
	const { failure } = useToasts()
	const [authenticate] = useMutation<any, MutationAuthenticateArgs>(AUTHENTICATE_USER)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	return useCallback(
		async (username: string, password: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await authenticate({ variables: { username, password } })
				logger('authentication response', resp)
				const authResp: AuthenticationResponse | null = resp.data?.authenticate
				if (authResp?.status === StatusType.Success) {
					result.status = StatusType.Success
					storeAccessToken(authResp.accessToken)
					setCurrentUser(authResp.user)
				}
				result.message = authResp.message
				// No success message only login
			} catch (error) {
				result.message = error
				failure(c('hooks.useAuth.loginFailed'), error)
			}

			return result
		},
		[c, failure, authenticate, setCurrentUser]
	)
}
