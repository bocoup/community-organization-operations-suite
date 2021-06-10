/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql, useQuery } from '@apollo/client'
import type { UserInput, AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { GET_ORGANIZATION } from './useOrganization'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'
import { cloneDeep } from 'lodash'
import { ApiResponse } from './types'

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

const UPDATE_SPECIALIST = gql`
	mutation updateUser($user: UserInput!) {
		updateUser(user: $user) {
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

interface useSpecialistReturn extends ApiResponse<User[]> {
	createSpecialist: (user: UserInput) => Promise<{ status: string; message?: string }>
	updateSpecialist: (user: UserInput) => Promise<{ status: string; message?: string }>
}

export function useSpecialist(): useSpecialistReturn {
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	const { loading, error, data, refetch } = useQuery(GET_ORGANIZATION, {
		variables: { orgId: authUser.user.roles[0].orgId },
		fetchPolicy: 'cache-and-network'
	})

	if (error) {
		console.error('error loading data', error)
	}

	const specialist: User[] = !loading && (data?.organization.users as User[])

	const [createNewUser] = useMutation(CREATE_NEW_SPECIALIST)
	const [updateUser] = useMutation(UPDATE_SPECIALIST)

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

	const updateSpecialist = async (user: UserInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await updateUser({
			variables: { user },
			update(cache, { data }) {
				const orgId = authUser.user.roles[0].orgId

				if (data.updateUser.message.toLowerCase() === 'success') {
					const existingOrgData = cache.readQuery({
						query: GET_ORGANIZATION,
						variables: { orgId }
					}) as any

					const orgData = cloneDeep(existingOrgData.organization)
					const userIdx = orgData.users.findIndex((u: User) => u.id === data.updateUser.user.id)
					orgData.users[userIdx] = data.updateUser.user

					cache.writeQuery({
						query: GET_ORGANIZATION,
						variables: { orgId },
						data: { organization: orgData }
					})

					result.status = 'success'
				}

				result.message = data.updateUser.message
			}
		})

		return result
	}

	return {
		loading,
		error,
		refetch,
		createSpecialist,
		updateSpecialist,
		data: specialist
	}
}
