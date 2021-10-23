/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import {
	VoidResponse,
	Organization,
	StatusType,
	MutationRemoveUserFromOrganizationArgs
} from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useRecoilState } from 'recoil'
import { organizationState } from '~store'
import { useCallback } from 'react'

const DELETE_SPECIALIST = gql`
	mutation removeUserFromOrganization($orgId: String!, $userId: String!) {
		removeUserFromOrganization(orgId: $orgId, userId: $userId) {
			message
			status
		}
	}
`

export type DeleteSpecialistCallback = (orgId: string, userId: string) => Promise<MessageResponse>

export function useDeleteSpecialistCallback(): DeleteSpecialistCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [deleteUser] = useMutation<any, MutationRemoveUserFromOrganizationArgs>(DELETE_SPECIALIST)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (orgId: string, userId: string) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				await deleteUser({
					variables: { userId, orgId },
					update(cache, { data }) {
						const updateUserResp = data.deleteUser as VoidResponse

						if (updateUserResp.status === StatusType.Success) {
							// Remove user locally
							setOrg({
								...organization,
								users: organization.users.filter((user) => user.id !== userId)
							})

							success(c('hooks.useSpecialist.deleteSpecialist.success'))
							result.status = StatusType.Success
						}

						result.message = updateUserResp.message
					}
				})
			} catch (error) {
				result.message = error
				failure(c('hooks.useSpecialist.deleteSpecialist.failed'), error)
			}

			return result
		},
		[c, success, failure, deleteUser, organization, setOrg]
	)
}
