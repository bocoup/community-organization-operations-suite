/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	AuthenticationResponse,
	User,
	Contact,
	UserActionResponse
} from '@resolve/schema/lib/client-types'
import { useRecoilState, useResetRecoilState } from 'recoil'
import {
	userAuthState,
	currentUserState,
	organizationState,
	engagementListState,
	myEngagementListState,
	inactiveEngagementListState
} from '~store'
import { CurrentUserFields, ContactFields } from './fragments'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}
	${ContactFields}

	mutation authenticate($body: AuthenticationInput!) {
		authenticate(body: $body) {
			accessToken
			user {
				...CurrentUserFields
			}
			contact {
				...ContactFields
			}
			message
			status
		}
	}
`

const RESET_USER_PASSWORD = gql`
	${CurrentUserFields}

	mutation resetUserPassword($body: UserIdInput!) {
		resetUserPassword(body: $body) {
			user {
				...CurrentUserFields
			}
			message
			status
		}
	}
`

export type BasicAuthCallback = (
	username: string,
	password: string
) => Promise<{ status: string; message?: string; isClient: boolean }>
export type LogoutCallback = () => void
export type ResetPasswordCallback = (
	userId: string
) => Promise<{ status: string; message?: string }>

export function useAuthUser(): {
	login: BasicAuthCallback
	logout: LogoutCallback
	resetPassword: ResetPasswordCallback
	authUser: AuthenticationResponse
	currentUserId: string
} {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [, setCurrentUser] = useRecoilState<User | Contact | null>(currentUserState)

	const resetOrg = useResetRecoilState(organizationState)
	const resetEngagement = useResetRecoilState(engagementListState)
	const resetMyEngagement = useResetRecoilState(myEngagementListState)
	const resetInactiveEngagement = useResetRecoilState(inactiveEngagementListState)
	const resetUserAuth = useResetRecoilState(userAuthState)
	const resetCurrentUser = useResetRecoilState(currentUserState)

	const login = async (username: string, password: string) => {
		const result = {
			status: 'failed',
			message: null,
			isClient: false
		}

		try {
			const resp = await authenticate({ variables: { body: { username, password } } })
			const authResp = resp.data?.authenticate as AuthenticationResponse
			if (authResp?.status === 'SUCCESS') {
				result.status = 'success'

				// Set the local store variables
				setUserAuth(authResp)

				if (authResp?.user) {
					setCurrentUser(authResp.user)
				}

				if (authResp.contact) {
					setCurrentUser(authResp.contact)
					result.isClient = true
				}
			}

			result.message = authResp.message

			// No success message only login
		} catch (error) {
			result.message = error
			failure(c('hooks.useAuth.login.failed'), error)
		}

		return result
	}

	const logout = () => {
		resetUserAuth()
		resetCurrentUser()
		resetOrg()
		resetEngagement()
		resetMyEngagement()
		resetInactiveEngagement()
	}

	const resetPassword = async (userId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			const resp = await resetUserPassword({ variables: { body: { userId } } })
			const resetUserPasswordResp = resp.data.resetUserPassword as UserActionResponse
			if (resetUserPasswordResp?.status === 'SUCCESS') {
				result.status = 'success'
				success(c('hooks.useAuth.reset.success'))
			}

			if (resetUserPasswordResp?.message.startsWith('SUCCESS_NO_MAIL')) {
				// For dev use only
				console.log(resetUserPasswordResp.message)
			}

			result.message = resetUserPasswordResp.message
		} catch (error) {
			result.message = error
			failure(c('hooks.useAuth.reset.failed'), error)
		}

		return result
	}

	return {
		login,
		logout,
		resetPassword,
		authUser,
		currentUserId: authUser?.user?.id
	}
}
