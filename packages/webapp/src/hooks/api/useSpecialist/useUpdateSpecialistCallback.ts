/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import {
	UserInput,
	User,
	UserResponse,
	StatusType,
	MutationUpdateUserArgs
} from '@cbosuite/schema/dist/client-types'
import { GET_ORGANIZATION } from '../useOrganization'
import { cloneDeep } from 'lodash'
import { MessageResponse } from '../types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { UserFields } from '../fragments'
import { useCurrentUser } from '../useCurrentUser'
import { useCallback } from 'react'

const UPDATE_SPECIALIST = gql`
	${UserFields}

	mutation updateUser($user: UserInput!) {
		updateUser(user: $user) {
			user {
				...UserFields
			}
			message
			status
		}
	}
`

export type UpdateSpecialistCallback = (user: UserInput) => Promise<MessageResponse>

export function useUpdateSpecialistCallback() {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [updateUser] = useMutation<any, MutationUpdateUserArgs>(UPDATE_SPECIALIST)
	const { orgId } = useCurrentUser()

	return useCallback(
		async (user) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				await updateUser({
					variables: { user },
					update(cache, { data }) {
						const updateUserResp = data.updateUser as UserResponse

						if (updateUserResp.status === StatusType.Success) {
							const existingOrgData = cache.readQuery({
								query: GET_ORGANIZATION,
								variables: { orgId }
							}) as any

							const orgData = cloneDeep(existingOrgData.organization)
							const userIdx = orgData.users.findIndex((u: User) => u.id === updateUserResp.user.id)
							orgData.users[userIdx] = updateUserResp.user

							cache.writeQuery({
								query: GET_ORGANIZATION,
								variables: { orgId },
								data: { organization: orgData }
							})

							success(c('hooks.useSpecialist.updateSpecialist.success'))
							result.status = StatusType.Success
						}

						result.message = updateUserResp.message
					}
				})
			} catch (error) {
				result.message = error
				failure(c('hooks.useSpecialist.updateSpecialist.failed'), error)
			}

			return result
		},
		[c, success, failure, updateUser, orgId]
	)
}
