/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
// import type { User } from '@greenlight/schema/lib/client-types'
import type { AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
// import { currentUserState } from '~store'
import { currentUserState, userAuthState } from '~store'
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
	const [isUserLoaded, setIsUserLoaded] = useState(false)
	const [authUser, setUserAuth] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	// Handle loading current user
	const [load, { loading }] = useLazyQuery(CURRENT_USER, {
		onCompleted: data => {
			if (data?.user) setCurrentUser(data.user)
		},
		onError: error => {
			console.log('Errors on useCurrentUser', error)
			setCurrentUser(null)
			setUserAuth({ ...authUser, accessToken: null })
		}
	})

	// Load the current user when an id is pressent
	useEffect(() => {
		if (userId && !isUserLoaded) {
			debugger
			load({ variables: { userId } })
			setIsUserLoaded(true)
		}
	}, [userId, load, isUserLoaded, setIsUserLoaded])

	const loadCurrentUser = async (userId?: string) => {
		if (userId && !isUserLoaded && !loading) {
			await load({ variables: { userId } })
			setIsUserLoaded(true)
		}
	}

	return {
		currentUser,
		loadCurrentUser
	}
}
