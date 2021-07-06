/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql, useQuery } from '@apollo/client'
import type { UserInput, AuthenticationResponse, User } from '@greenlight/schema/lib/client-types'
import { GET_ORGANIZATION } from './useOrganization'
import { useRecoilValue } from 'recoil'
import { userAuthState } from '~store'
import { cloneDeep } from 'lodash'
import { ApiResponse } from './types'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

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
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()
	const authUser = useRecoilValue<AuthenticationResponse>(userAuthState)
	const { loading, error, data, refetch } = useQuery(GET_ORGANIZATION, {
		variables: { body: { orgId: authUser?.user?.roles[0]?.orgId } },
		fetchPolicy: 'cache-and-network'
	})

	if (error) {
		console.error(c('hooks.useSpecialist.loadData.failed'), error)
	}

	const specialist: User[] = !loading && (data?.organization?.users as User[])

	const [createNewUser] = useMutation(CREATE_NEW_SPECIALIST)
	const [updateUser] = useMutation(UPDATE_SPECIALIST)

	const createSpecialist: useSpecialistReturn['createSpecialist'] = async newUser => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			await createNewUser({
				variables: { newUser: newUser },
				update(cache, { data }) {
					const orgId = authUser.user.roles[0].orgId

					if (data.createNewUser.message.toLowerCase() === 'success') {
						const existingOrgData = cache.readQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } }
						}) as any

						const newData = cloneDeep(existingOrgData.organization)
						newData.users.push(data.createNewUser.user)
						newData.users.sort((a: User, b: User) => (a.name.first > b.name.first ? 1 : -1))

						cache.writeQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } },
							data: { organization: newData }
						})
						result.status = 'success'

						success(c('hooks.useSpecialist.createSpecialist.success'))
					}
					result.message = data.createNewUser.message
				}
			})
		} catch (error) {
			result.message = error
			failure(c('hooks.useSpecialist.createSpecialist.failed'), error)
		}

		return result
	}

	const updateSpecialist: useSpecialistReturn['updateSpecialist'] = async user => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			await updateUser({
				variables: { user },
				update(cache, { data }) {
					const orgId = authUser.user.roles[0].orgId

					if (data.updateUser.message.toLowerCase() === 'success') {
						const existingOrgData = cache.readQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } }
						}) as any

						const orgData = cloneDeep(existingOrgData.organization)
						const userIdx = orgData.users.findIndex((u: User) => u.id === data.updateUser.user.id)
						orgData.users[userIdx] = data.updateUser.user

						cache.writeQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } },
							data: { organization: orgData }
						})

						success(c('hooks.useSpecialist.updateSpecialist.failed'))
						result.status = 'success'
					}

					result.message = data.updateUser.message
				}
			})
		} catch (error) {
			result.message = error
			failure(c('hooks.useSpecialist.updateSpecialist.failed'), error)
		}

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
