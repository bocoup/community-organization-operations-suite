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
							// in kiosk mode, we haven't set any of this, nor would we want to
							// because it'd just me more PID that we don't to expose.
							if (organization?.contacts) {
								setOrganization({
									...organization,
									contacts: [...organization.contacts, createContact.contact].sort(byFirstName)
								})
							}
							// however, we do need this in kiosk mode, at least until the form is submitted:
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
