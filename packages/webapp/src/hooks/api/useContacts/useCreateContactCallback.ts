/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	Contact,
	ContactInput,
	ContactResponse,
	MutationCreateContactArgs,
	Organization
} from '@cbosuite/schema/dist/client-types'
import { organizationState, addedContactState } from '~store'
import { useRecoilState } from 'recoil'
import { ContactFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const CREATE_CONTACT = gql`
	${ContactFields}

	mutation createContact($contact: ContactInput!) {
		createContact(contact: $contact) {
			contact {
				...ContactFields
			}
			message
		}
	}
`

export type CreateContactCallback = (contact: ContactInput) => Promise<MessageResponse>

export function useCreateContactCallback(): CreateContactCallback {
	const toast = useToasts()
	const [createContactGQL] = useMutation<any, MutationCreateContactArgs>(CREATE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const [, setAddedContact] = useRecoilState<Contact | null>(addedContactState)
	return useCallback(
		async (contact) => {
			let result: MessageResponse
			await createContactGQL({
				variables: { contact },
				update(_cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: ({ createContact }: { createContact: ContactResponse }) =>
							createContact.message,
						onSuccess: ({ createContact }: { createContact: ContactResponse }) => {
							// In kiosk mode, we haven't set this in the store as it would expose other client's data,
							// so we should not try to update it either as it'd cause an error.
							if (organization?.contacts) {
								setOrganization({
									...organization,
									contacts: [...organization.contacts, createContact.contact].sort(byFirstName)
								})
							}
							// however, we do need the new contact, especially when in that kiosk mode:
							setAddedContact(createContact.contact)
							return createContact.message
						}
					})
				}
			})

			return result
		},
		[createContactGQL, organization, setAddedContact, setOrganization, toast]
	)
}

const byFirstName = (a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1)
