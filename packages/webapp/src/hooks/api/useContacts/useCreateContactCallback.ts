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
import { useOffline } from '~hooks/useOffline'
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'
import { GET_ORGANIZATION } from '../useOrganization'
import { useCurrentUser } from '../useCurrentUser'

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

export type CreateContactCallback = (contact: ContactInput) => MessageResponse

export function useCreateContactCallback(): CreateContactCallback {
	const toast = useToasts()
	const { orgId } = useCurrentUser()
	const isOffline = useOffline()
	const [createContactGQL] = useMutation<any, MutationCreateContactArgs>(CREATE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const [, setAddedContact] = useRecoilState<Contact | null>(addedContactState)
	return useCallback(
		(contact) => {
			let result: MessageResponse
			const newContactTempId = crypto.randomUUID()

			// TODO: We need to add some properties to out optimistic response. These properties are also populated by the GQL resolvers so now we have 2 spots where
			// this logic happens. It would be nice if we could DRY this out.
			createContactGQL({
				variables: { contact },
				optimisticResponse: {
					createContact: {
						message: 'Success',
						contact: {
							...contact,
							name: { first: contact.first, middle: contact.middle || null, last: contact.last },
							status: 'ACTIVE',
							engagements: [],
							id: newContactTempId,
							__typename: 'Contact'
						},
						__typename: 'ContactResponse'
					}
				},
				update(cache, resp) {
					const hideSuccessToast =
						!isOffline && resp.data?.createContact.contact.id === newContactTempId
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: hideSuccessToast
							? null
							: ({ createContact }: { createContact: ContactResponse }) => createContact.message,
						onSuccess: ({ createContact }: { createContact: ContactResponse }) => {
							// TODO: Seems like this gets called after we update the cache, AND after we get the server response...
							// In kiosk mode, we haven't set this in the store as it would expose other client's data,
							// so we should not try to update it either as it'd cause an error.
							if (organization?.contacts) {
								const filteredContacts = organization.contacts.filter(
									(contact) => contact.id !== newContactTempId
								)
								setOrganization({
									...organization,
									contacts: [...filteredContacts, createContact.contact].sort(byFirstName)
								})
							}
							// however, we do need the new contact, especially when in that kiosk mode:
							setAddedContact(createContact.contact)
							return createContact.message
						}
					})

					// Update the cache with out optimistic response
					// optimisticResponse or serverResponse
					const newContact = resp.data?.createContact.contact

					if (newContact && newContact.id === newContactTempId) {
						const existingOrgData = cache.readQuery({
							query: GET_ORGANIZATION,
							variables: { orgId }
						}) as any

						cache.writeQuery({
							query: GET_ORGANIZATION,
							variables: { orgId },
							data: {
								organization: {
									...existingOrgData.organization,
									contacts: [...existingOrgData.organization.contacts, newContact].sort(byFirstName)
								}
							}
						})
					}
				}
			})

			return result
		},
		[createContactGQL, organization, orgId, isOffline, setAddedContact, setOrganization, toast]
	)
}

const byFirstName = (a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1)
