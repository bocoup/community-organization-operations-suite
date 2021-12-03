/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import {
	Organization,
	MutationDeleteUserArgs,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useRecoilState } from 'recoil'
import { organizationState } from '~store'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const DELETE_SPECIALIST = gql`
	mutation deleteUser($userId: String!) {
		deleteUser(userId: $userId) {
			message
		}
	}
`

export type DeleteSpecialistCallback = (userId: string) => Promise<MessageResponse>

export function useDeleteSpecialistCallback(): DeleteSpecialistCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [deleteUser] = useMutation<any, MutationDeleteUserArgs>(DELETE_SPECIALIST)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (userId) => {
			let result: MessageResponse

			await deleteUser({
				variables: { userId },
				update(_cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useSpecialist.deleteSpecialist.success'),
						failureToast: c('hooks.useSpecialist.deleteSpecialist.failed'),
						onSuccess: ({ deleteUser }: { deleteUser: VoidResponse }) => {
							// Remove user locally
							setOrg({
								...organization,
								users: organization.users.filter((user) => user.id !== userId)
							})

							return deleteUser.message
						}
					})
				}
			})
			return result
		},
		[c, toast, deleteUser, organization, setOrg]
	)
}
