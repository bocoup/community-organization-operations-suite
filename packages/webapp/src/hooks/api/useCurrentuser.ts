/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import type { User } from '@greenlight/schema/lib/client-types'
// import type { AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
// import { currentUserState, userAuthState } from '~store'
import { CurrentUserFields } from './fragments'

const CURRENT_USER = gql`
	${CurrentUserFields}

	query user($userId: String!) {
		user(userId: $userId) {
			...CurrentUserFields
		}
	}
`

export function useCurrentUser(userId?: string): {
	currentUser: User
	loadCurrentUser: (userId: string) => void
} {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	// const [, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	// Handle loading current user
	const [load] = useLazyQuery(CURRENT_USER, {
		onCompleted: data => {
			debugger
			// Check user permssion here if a user is currently logged in
			if (data?.user) setCurrentUser(data.user)
		},
		onError: error => {
			debugger
			console.log('Error loading current user')
			console.log('Errors on useCurrentUser', error)
			// setCurrentUser(null)
			// setUserAuth(null)
		}
	})

	// Load the current user when an id is pressent
	useEffect(() => {
		if (userId) {
			load({ variables: { userId } })
		}
	}, [userId, load])

	const loadCurrentUser = (userId?: string): void => {
		if (userId) {
			load({ variables: { userId } })
		}
	}

	return {
		currentUser,
		loadCurrentUser
	}
}
