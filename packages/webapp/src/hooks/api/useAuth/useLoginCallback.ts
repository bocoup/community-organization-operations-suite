/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { AuthenticationResponse, StatusType, User } from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { userAuthResponseState, currentUserState } from '~store'
import { CurrentUserFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { AuthResponse, MessageResponse } from '../types'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'
const logger = createLogger('useAuth')

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($body: AuthenticationInput!) {
		authenticate(body: $body) {
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
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	// TODO: why is this two states?
	const [, setUserAuth] = useRecoilState<AuthResponse | null>(userAuthResponseState)
	const [, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	return useCallback(
		async (username: string, password: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				const resp = await authenticate({ variables: { body: { username, password } } })
				logger('authentication response', resp)
				const authResp: AuthenticationResponse | null = resp.data?.authenticate
				if (authResp?.status === StatusType.Success) {
					result.status = StatusType.Success
					// Set the local store variables
					setUserAuth({
						accessToken: authResp.accessToken,
						message: authResp.message,
						status: authResp.status
					})
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
		[c, failure, authenticate, setUserAuth, setCurrentUser]
	)
}
