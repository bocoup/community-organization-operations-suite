/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	ContactInput,
	ContactResponse,
	MutationUpdateContactArgs,
	Organization
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { ContactFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const UPDATE_CONTACT = gql`
	${ContactFields}

	mutation updateContact($contact: ContactInput!) {
		updateContact(contact: $contact) {
			contact {
				...ContactFields
			}
			message
		}
	}
`
export type UpdateContactCallback = (contact: ContactInput) => Promise<MessageResponse>

export function useUpdateContactCallback(): UpdateContactCallback {
	const toast = useToasts()
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const [updateContactGQL] = useMutation<any, MutationUpdateContactArgs>(UPDATE_CONTACT)

	return useCallback(
		async (contact) => {
			let result: MessageResponse
			await updateContactGQL({
				variables: { contact },
				update(_cache, res) {
					result = handleGraphqlResponseSync(res, {
						toast,
						successToast: ({ updateContact }: { updateContact: ContactResponse }) =>
							updateContact.message,
						failureToast: (err) => err[0].message,
						onSuccess: ({ updateContact }: { updateContact: ContactResponse }) => {
							setOrganization({
								...organization,
								contacts: organization.contacts.map((c) =>
									c.id === updateContact.contact.id ? updateContact.contact : c
								)
							})
							return updateContact.message
						}
					})
				}
			})

			return result
		},
		[toast, organization, setOrganization, updateContactGQL]
	)
}
