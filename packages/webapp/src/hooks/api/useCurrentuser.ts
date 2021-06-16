/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import type { User } from '@greenlight/schema/lib/client-types'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { OrgUserFields } from './fragments'

const CURRENT_USER = gql`
	${OrgUserFields}

	query user($userId: String!) {
		user(userId: $userId) {
			...OrgUserFields
		}
	}
`

export function useCurrentUser(
	userId?: string
): {
	currentUser: User
} {
	const [loadCurrentUser, { loading, data, error }] = useLazyQuery(CURRENT_USER)
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	// Check user permssion here if a user is currently logged in
	useEffect(() => {
		if (userId) {
			loadCurrentUser({ variables: { userId } })
			// Check if user is logged in (create a useQuery for this)
			// Log user out if auth check fails
		}
	}, [userId, loadCurrentUser])

	// Update current user when data is present
	useEffect(() => {
		if (data) debugger

		if (data?.user?.user) setCurrentUser(data.user.user)

		if (!loading && error) {
			console.log('Errors on useCurrentUser', error)
			// Todo: probably clear current user here
			debugger
		}
	}, [data, loading, error, setCurrentUser])

	return {
		currentUser
	}
}
