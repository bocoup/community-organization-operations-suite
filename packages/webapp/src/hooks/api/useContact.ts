/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql, useMutation } from '@apollo/client'
import { ApiResponse } from './types'
import type { Contact, ContactInput } from '@greenlight/schema/lib/client-types'
import { ContactFields } from '~hooks/api/fragments'
import { useAuthUser } from '~hooks/api/useAuth'
import { contactListState } from '~store'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { cloneDeep, get } from 'lodash'

export const GET_CONTACTS = gql`
	${ContactFields}

	query contacts($orgId: String!, $offset: Int, $limit: Int) {
		contacts(orgId: $orgId, offset: $offset, limit: $limit) {
			...ContactFields
		}
	}
`

export const CREATE_CONTACT = gql`
	mutation createNewContact($contact: ContactInput!) {
		createNewContact(contact: $contact) {
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
	createContact: (contact: ContactInput) => Promise<{ status: string; message?: string }>
	updateContact: (contact: ContactInput) => Promise<{ status: string; message?: string }>
}

export function useContacts(): useContactReturn {
	const { authUser } = useAuthUser()

	// FIXME: this is not how we shold be getting the user role. Role needs to match the specific org
	const userRole = get(authUser, 'user.roles[0]')

	const { loading, error, data, refetch } = useQuery(GET_CONTACTS, {
		variables: { orgId: userRole?.orgId, offset: 0, limit: 500 },
		fetchPolicy: 'no-cache'
	})
	const [contacts, setContacts] = useRecoilState<Contact[] | null>(contactListState)

	if (error) {
		console.error('error loading data', error)
	}

	// const contacts: Contact[] = !loading && (data?.contacts as Contact[])

	useEffect(() => {
		if (data?.contacts) {
			setContacts(data.contacts)
		}
	}, [data, setContacts])

	const [createNewContactGQL] = useMutation(CREATE_CONTACT)
	const [updateContactGQL] = useMutation(UPDATE_CONTACT)

	const createContact = async (contact: ContactInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createNewContactGQL({
			variables: { contact },
			update(cache, { data }) {
				if (data.createNewContact.message.toLowerCase() === 'success') {
					const newData = cloneDeep(contacts) as Contact[]
					newData.push(data.createNewContact.contact)
					newData.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
					setContacts(newData)
					result.status = 'success'
				}
				result.message = data.createNewContact.message
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
					const newData = cloneDeep(contacts) as Contact[]
					const contactIdx = newData.findIndex(
						(c: Contact) => c.id === data.updateContact.contact.id
					)

					newData[contactIdx] = data.updateContact.contact

					setContacts(newData)
					result.status = 'success'
				}

				result.message = data.updateContact.message
			}
		})

		return result
	}

	return {
		loading,
		error,
		data: contacts,
		createContact,
		updateContact,
		refetch
	}
}
