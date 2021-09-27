/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	UserInput,
	User,
	UserResponse,
	VoidResponse,
	Organization
} from '@cbosuite/schema/lib/client-types'
import { GET_ORGANIZATION, useOrganization } from './useOrganization'
import { cloneDeep } from 'lodash'
import { ApiResponse } from './types'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { UserFields } from './fragments'
import { useCurrentUser } from './useCurrentUser'
import { useRecoilState } from 'recoil'
import { organizationState } from '~store'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useSpecialist')

const CREATE_NEW_SPECIALIST = gql`
	${UserFields}

	mutation createNewUser($body: UserInput!) {
		createNewUser(body: $body) {
			user {
				...UserFields
			}
			message
			status
		}
	}
`
const UPDATE_SPECIALIST = gql`
	${UserFields}

	mutation updateUser($body: UserInput!) {
		updateUser(body: $body) {
			user {
				...UserFields
			}
			message
			status
		}
	}
`

const DELETE_SPECIALIST = gql`
	mutation deleteUser($body: UserIdInput!) {
		deleteUser(body: $body) {
			message
			status
		}
	}
`

interface useSpecialistReturn extends ApiResponse<User[]> {
	createSpecialist: (user: UserInput) => Promise<{ status: string; message?: string }>
	updateSpecialist: (user: UserInput) => Promise<{ status: string; message?: string }>
	deleteSpecialist: (userId: string) => Promise<{ status: string; message?: string }>
	specialistList: User[]
}

export function useSpecialist(): useSpecialistReturn {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const { loading, error } = useOrganization()
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	if (error) {
		logger(c('hooks.useSpecialist.loadData.failed'), error)
	}

	const specialistList: User[] = organization?.users || []

	const [createNewUser] = useMutation(CREATE_NEW_SPECIALIST)
	const [updateUser] = useMutation(UPDATE_SPECIALIST)
	const [deleteUser] = useMutation(DELETE_SPECIALIST)

	const createSpecialist: useSpecialistReturn['createSpecialist'] = async (newUser) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			await createNewUser({
				variables: { body: newUser },
				update(cache, { data }) {
					const createNewUserResp = data.createNewUser as UserResponse

					if (createNewUserResp.status === 'SUCCESS') {
						const existingOrgData = cache.readQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } }
						}) as any

						const newData = cloneDeep(existingOrgData.organization)
						newData.users.push(createNewUserResp.user)
						newData.users.sort((a: User, b: User) => (a.name.first > b.name.first ? 1 : -1))

						cache.writeQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } },
							data: { organization: newData }
						})
						result.status = 'success'

						success(c('hooks.useSpecialist.createSpecialist.success'))
					}
					if (createNewUserResp?.message.startsWith('SUCCESS_NO_MAIL')) {
						// For dev use only
						logger(createNewUserResp.message)
					}
					result.message = createNewUserResp.message
				}
			})
		} catch (error) {
			result.message = error
			failure(c('hooks.useSpecialist.createSpecialist.failed'), error)
		}

		return result
	}

	const updateSpecialist: useSpecialistReturn['updateSpecialist'] = async (user) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			await updateUser({
				variables: { body: user },
				update(cache, { data }) {
					const updateUserResp = data.updateUser as UserResponse

					if (updateUserResp.status === 'SUCCESS') {
						const existingOrgData = cache.readQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } }
						}) as any

						const orgData = cloneDeep(existingOrgData.organization)
						const userIdx = orgData.users.findIndex((u: User) => u.id === updateUserResp.user.id)
						orgData.users[userIdx] = updateUserResp.user

						cache.writeQuery({
							query: GET_ORGANIZATION,
							variables: { body: { orgId } },
							data: { organization: orgData }
						})

						success(c('hooks.useSpecialist.updateSpecialist.success'))
						result.status = 'success'
					}

					result.message = updateUserResp.message
				}
			})
		} catch (error) {
			result.message = error
			failure(c('hooks.useSpecialist.updateSpecialist.failed'), error)
		}

		return result
	}

	const deleteSpecialist: useSpecialistReturn['deleteSpecialist'] = async (userId) => {
		const result = {
			status: 'failed',
			message: null
		}

		try {
			await deleteUser({
				variables: { body: { userId } },
				update(cache, { data }) {
					const updateUserResp = data.deleteUser as VoidResponse

					if (updateUserResp.status === 'SUCCESS') {
						// Remove user locally
						setOrg({
							...organization,
							users: organization.users.filter((user) => user.id !== userId)
						})

						success(c('hooks.useSpecialist.deleteSpecialist.success'))
						result.status = 'success'
					}

					result.message = updateUserResp.message
				}
			})
		} catch (error) {
			result.message = error
			failure(c('hooks.useSpecialist.deleteSpecialist.failed'), error)
		}

		return result
	}

	return {
		loading,
		error,
		createSpecialist,
		updateSpecialist,
		deleteSpecialist,
		specialistList
	}
}
