/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type { UserInput, AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { GET_ORGANIZATION } from './useOrganization'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'
import { cloneDeep } from 'lodash'

const CREATE_NEW_SPECIALIST = gql`
	mutation createNewUser($newUser: UserInput!) {
		createNewUser(user: $newUser) {
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

export function useSpecialist(): {
	createSpecialist: (user: UserInput) => Promise<{ status: string; message?: string }>
} {
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	const [createNewUser] = useMutation(CREATE_NEW_SPECIALIST)

	const createSpecialist = async (newUser: UserInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createNewUser({
			variables: { newUser: newUser },
			update(cache, { data }) {
				const orgId = authUser.user.roles[0].orgId

				if (data.createNewUser.message.toLowerCase() === 'success') {
					const existingOrgData = cache.readQuery({
						query: GET_ORGANIZATION,
						variables: { orgId }
					}) as any

					const newData = cloneDeep(existingOrgData.organization)
					newData.users.push(data.createNewUser.user)
					newData.users.sort((a: User, b: User) => (a.name.first > b.name.first ? 1 : -1))

					cache.writeQuery({
						query: GET_ORGANIZATION,
						variables: { orgId },
						data: { organization: newData }
					})

					result.status = 'success'
				}

				result.message = data.createNewUser.message
			}
		})

		return result
	}

	return {
		createSpecialist
	}
}
