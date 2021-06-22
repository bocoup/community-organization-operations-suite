/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ApiResponse } from './types'
import type { Contact, ContactInput, Organization } from '@greenlight/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'

export const CREATE_CONTACT = gql`
	mutation createContact($contact: ContactInput!) {
		createContact(contact: $contact) {
			contact {
				id
				email
				phone
				dateOfBirth
				address {
					street
					unit
					city
					state
					zip
				}
				name {
					first
					middle
					last
				}
				engagements {
					id
					status
				}
			}
			message
		}
	}
`

export const UPDATE_CONTACT = gql`
	mutation updateContact($contact: ContactInput!) {
		updateContact(contact: $contact) {
			contact {
				id
				email
				phone
				dateOfBirth
				address {
					street
					unit
					city
					state
					zip
				}
				name {
					first
					middle
					last
				}
				engagements {
					id
					status
				}
			}
			message
		}
	}
`
interface useContactReturn extends ApiResponse<Contact[]> {
	contacts: Contact[]
	createContact: (contact: ContactInput) => Promise<{ status: string; message?: string }>
	updateContact: (contact: ContactInput) => Promise<{ status: string; message?: string }>
}

export function useContacts(): useContactReturn {
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)

	const [createContactGQL] = useMutation(CREATE_CONTACT)
	const [updateContactGQL] = useMutation(UPDATE_CONTACT)

	const createContact = async (contact: ContactInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createContactGQL({
			variables: { contact },
			update(cache, { data }) {
				if (data.createContact.message.toLowerCase() === 'success') {
					const newData = cloneDeep(organization.contacts) as Contact[]
					newData.push(data.createContact.contact)
					// newData.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
					setOrganization({ ...organization, contacts: newData })
					result.status = 'success'
				}
				result.message = data.createContact.message
			}
		})

		return result
	}

	const updateContact = async (contact: ContactInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await updateContactGQL({
			variables: { contact },
			update(cache, { data }) {
				if (data.updateContact.message.toLowerCase() === 'success') {
					const newData = cloneDeep(organization.contacts) as Contact[]
					const contactIdx = newData.findIndex((c: Contact) => {
						return c.id === data.updateContact.contact.id
					})
					newData[contactIdx] = data.updateContact.contact
					setOrganization({ ...organization, contacts: newData })
					result.status = 'success'
				}

				result.message = data.updateContact.message
			}
		})

		return result
	}

	return {
		contacts: organization?.contacts,
		createContact,
		updateContact
	}
}
