/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import type {
	UserInput,
	UserResponse,
	MutationUpdateUserArgs
} from '@cbosuite/schema/dist/client-types'
import { GET_ORGANIZATION } from '../useOrganization'
import type { MessageResponse } from '../types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { UserFields } from '../fragments'
import { useCurrentUser } from '../useCurrentUser'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'
import { empty } from '~utils/noop'

const UPDATE_SPECIALIST = gql`
	${UserFields}

	mutation updateUser($user: UserInput!) {
		updateUser(user: $user) {
			user {
				...UserFields
			}
			message
		}
	}
`

export type UpdateSpecialistCallback = (user: UserInput) => Promise<MessageResponse>

export function useUpdateSpecialistCallback() {
	const { c } = useTranslation()
	const toast = useToasts()
	const [updateUser] = useMutation<any, MutationUpdateUserArgs>(UPDATE_SPECIALIST)
	const { orgId, currentUser, setCurrentUser } = useCurrentUser()

	return useCallback(
		async (user: UserInput) => {
			let result: MessageResponse
			await updateUser({
				variables: { user },
				update(cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useSpecialist.updateSpecialist.success'),
						failureToast: c('hooks.useSpecialist.updateSpecialist.failed'),
						onSuccess: ({ updateUser }: { updateUser: UserResponse }) => {
							if (updateUser.user.id === currentUser.id) {
								// update current user if mutating current user
								setCurrentUser({
									...currentUser,
									...updateUser.user,
									mentions: currentUser?.mentions || empty
								})
							}

							const orgData = cache.readQuery({
								query: GET_ORGANIZATION,
								variables: { orgId }
							}) as any

							cache.writeQuery({
								query: GET_ORGANIZATION,
								variables: { orgId },
								data: {
									organization: {
										...orgData,
										users: orgData.users?.map((user) =>
											user.id === updateUser.user.id ? updateUser.user : user
										)
									}
								}
							})

							return updateUser.message
						}
					})
				}
			})
			return result
		},
		[c, toast, updateUser, orgId, currentUser, setCurrentUser]
	)
}
