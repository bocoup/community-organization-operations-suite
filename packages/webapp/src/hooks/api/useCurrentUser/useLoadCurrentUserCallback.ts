/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { createLogger } from '~utils/createLogger'
import { CurrentUserFields } from '../fragments'
import { useRecoilState } from 'recoil'
import type { User } from '@cbosuite/schema/dist/client-types'
import { currentUserState } from '~store'
const logger = createLogger('useCurrentUser')

const GET_CURRENT_USER = gql`
	${CurrentUserFields}

	query user($userId: String!) {
		user(userId: $userId) {
			...CurrentUserFields
		}
	}
`

export type LoadUserCallback = (userId: string) => void

export function useLoadCurrentUserCallback(): {
	load: LoadUserCallback
	loading: boolean
	error?: Error
} {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const [executeLoad, { loading, error }] = useLazyQuery(GET_CURRENT_USER, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			if (data?.user) {
				setCurrentUser(data.user)
			}
		},
		onError: (error) => {
			if (error) {
				logger('Error loading data', error)
			}
		}
	})

	const load = useCallback(
		(userId: string) => executeLoad({ variables: { userId } }),
		[executeLoad]
	)

	useEffect(() => {
		if (currentUser?.id) {
			load(currentUser?.id)
		}
	}, [currentUser?.id, load])

	return {
		load: load,
		loading,
		error
	}
}
