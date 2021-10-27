/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import {
	UserInput,
	User,
	UserResponse,
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
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

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
	const toast = useToasts()
	const [updateUser] = useMutation<any, MutationUpdateUserArgs>(UPDATE_SPECIALIST)
	const { orgId } = useCurrentUser()

	return useCallback(
		async (user) => {
			let result: MessageResponse
			await updateUser({
				variables: { user },
				update(cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useSpecialist.updateSpecialist.success'),
						failureToast: c('hooks.useSpecialist.updateSpecialist.failed'),
						onSuccess: ({ updateUser }: { updateUser: UserResponse }) => {
							const existingOrgData = cache.readQuery({
								query: GET_ORGANIZATION,
								variables: { orgId }
							}) as any

							const orgData = cloneDeep(existingOrgData.organization)
							const userIdx = orgData.users.findIndex((u: User) => u.id === updateUser.user.id)
							orgData.users[userIdx] = updateUser.user

							cache.writeQuery({
								query: GET_ORGANIZATION,
								variables: { orgId },
								data: { organization: orgData }
							})

							return updateUser.message
						}
					})
				}
			})
			return result
		},
		[c, toast, updateUser, orgId]
	)
}
