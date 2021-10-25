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
	MutationCreateNewUserArgs
} from '@cbosuite/schema/dist/client-types'
import { GET_ORGANIZATION } from '../useOrganization'
import { cloneDeep } from 'lodash'
import { MessageResponse } from '../types'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { UserFields } from '../fragments'
import { useCurrentUser } from '../useCurrentUser'
import { createLogger } from '~utils/createLogger'
import { useCallback } from 'react'
const logger = createLogger('useSpecialist')

const CREATE_NEW_SPECIALIST = gql`
	${UserFields}

	mutation createNewUser($user: UserInput!) {
		createNewUser(user: $user) {
			user {
				...UserFields
			}
			message
			status
		}
	}
`
export type CreateSpecialistCallback = (user: UserInput) => Promise<MessageResponse>

export function useCreateSpecialistCallback(): CreateSpecialistCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const { orgId } = useCurrentUser()
	const [createNewUser] = useMutation<any, MutationCreateNewUserArgs>(CREATE_NEW_SPECIALIST)

	return useCallback(
		async (newUser) => {
			const result: MessageResponse = { status: StatusType.Failed }

			try {
				await createNewUser({
					variables: { user: newUser },
					update(cache, { data }) {
						const createNewUserResp = data.createNewUser as UserResponse

						if (createNewUserResp.status === StatusType.Success) {
							const existingOrgData = cache.readQuery({
								query: GET_ORGANIZATION,
								variables: { orgId }
							}) as any

							const newData = cloneDeep(existingOrgData.organization)
							newData.users.push(createNewUserResp.user)
							newData.users.sort((a: User, b: User) => (a.name.first > b.name.first ? 1 : -1))

							cache.writeQuery({
								query: GET_ORGANIZATION,
								variables: { orgId },
								data: { organization: newData }
							})
							result.status = StatusType.Success

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
		},
		[c, success, failure, orgId, createNewUser]
	)
}
