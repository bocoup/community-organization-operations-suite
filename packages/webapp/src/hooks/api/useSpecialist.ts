/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type { UserRequest, AuthenticationResponse } from '@greenlight/schema/lib/client-types'
import { GET_ORGANIZATION } from './useOrganization'
import { useRecoilState } from 'recoil'
import { userAuthState } from '~store'
import { cloneDeep } from 'lodash'

const CREATE_NEW_SPECIALIST = gql`
	mutation createNewUser($userRequest: UserRequest!) {
		createNewUser(user: $userRequest) {
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
	isSuccess: boolean
	createSpecialist: (user: UserRequest) => void
} {
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)

	const [createNewUser] = useMutation(CREATE_NEW_SPECIALIST)

	let isSuccess = false
	const createSpecialist = async (newUser: UserRequest) => {
		await createNewUser({
			variables: { userRequest: newUser },
			update(cache, { data }) {
				const orgId = authUser.user.roles[0].orgId

				isSuccess = data.createNewUser.message.toLowerCase() === 'success'

				const existingOrgData = cache.readQuery({
					query: GET_ORGANIZATION,
					variables: { orgId }
				}) as any

				const newData = cloneDeep(existingOrgData.organization)
				newData.users.push(data.createNewUser.user)

				cache.writeQuery({
					query: GET_ORGANIZATION,
					variables: { orgId },
					data: { organization: newData }
				})
			}
		})
	}

	return {
		createSpecialist,
		isSuccess
	}
}
