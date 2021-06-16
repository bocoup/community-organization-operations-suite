/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type { AuthenticationResponse } from '@greenlight/schema/lib/client-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'
import { CurrentUserFields } from './fragments'

const AUTHENTICATE_USER = gql`
	${CurrentUserFields}

	mutation authenticate($username: String!, $password: String!) {
		authenticate(username: $username, password: $password) {
			message
			accessToken
			user {
				...CurrentUserFields
			}
		}
	}
`

const RESET_USER_PASSWORD = gql`
	mutation resetUserPassword($userId: String!) {
		resetUserPassword(id: $userId) {
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

export type BasicAuthCallback = (
	username: string,
	password: string
) => Promise<{ status: string; message?: string }>
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
	const [authenticate] = useMutation(AUTHENTICATE_USER)
	const [resetUserPassword] = useMutation(RESET_USER_PASSWORD)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	// Check user permssion here if a user is currently logged in
	useEffect(() => {
		if (authUser) {
			// Check if user is logged in (create a useQuery for this)
			// Log user out if auth check fails
			console.log('authUser', authUser)
		}
	}, [authUser])

	const login = async (username: string, password: string) => {
		try {
			const result = {
				status: 'failed',
				message: null
			}

			const resp = await authenticate({ variables: { username, password } })
			setUserAuth(resp.data.authenticate)

			if (resp.data.authenticate.message.toLowerCase() === 'auth success') {
				result.status = 'success'
			}

			result.message = resp.data.authenticate.message
			return result
		} catch (error) {
			// TODO: handle error: 404, 500, etc..
			console.log('error', error)
		}
	}

	const logout = () => {
		setUserAuth(null)
	}

	const resetPassword = async (userId: string) => {
		const result = {
			status: 'failed',
			message: null
		}

		const resp = await resetUserPassword({ variables: { userId } })

		if (resp.data.resetUserPassword.message.toLowerCase() === 'success') {
			result.status = 'success'
		}

		result.message = resp.data.resetUserPassword.message
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
