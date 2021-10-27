/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMutation, gql } from '@apollo/client'
import {
	UserInput,
	User,
	UserResponse,
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
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'
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
	const toast = useToasts()
	const { orgId } = useCurrentUser()
	const [createNewUser] = useMutation<any, MutationCreateNewUserArgs>(CREATE_NEW_SPECIALIST)

	return useCallback(
		async (newUser) => {
			let result: MessageResponse

			await createNewUser({
				variables: { user: newUser },
				update(cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useSpecialist.createSpecialist.success'),
						failureToast: c('hooks.useSpecialist.createSpecialist.failed'),

						onSuccess: ({ createNewUser }: { createNewUser: UserResponse }) => {
							const existingOrgData = cache.readQuery({
								query: GET_ORGANIZATION,
								variables: { orgId }
							}) as any

							const newData = cloneDeep(existingOrgData.organization)
							newData.users.push(createNewUser.user)
							newData.users.sort((a: User, b: User) => (a.name.first > b.name.first ? 1 : -1))

							cache.writeQuery({
								query: GET_ORGANIZATION,
								variables: { orgId },
								data: { organization: newData }
							})

							if (createNewUser?.message.startsWith('SUCCESS_NO_MAIL')) {
								// For dev use only
								result.message = createNewUser.message
								logger(createNewUser.message)
							}
							return createNewUser.message
						}
					})
				}
			})

			return result
		},
		[c, toast, orgId, createNewUser]
	)
}
