/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	Contact,
	ContactInput,
	ContactResponse,
	Organization
} from '@community-organization-operations-suite/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'
import { ContactFields } from './fragments'

export const CREATE_CONTACT = gql`
	${ContactFields}

	mutation createContact($body: ContactInput!) {
		createContact(body: $body) {
			contact {
				...ContactFields
			}
			message
			status
		}
	}
`

export const UPDATE_CONTACT = gql`
	${ContactFields}

	mutation updateContact($body: ContactInput!) {
		updateContact(body: $body) {
			contact {
				...ContactFields
			}
			message
			status
		}
	}
`
interface useContactReturn {
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
			variables: { body: contact },
			update(cache, { data }) {
				const createContactResp = data.createContact as ContactResponse
				if (createContactResp.status === 'SUCCESS') {
					const newData = cloneDeep(organization.contacts) as Contact[]
					newData.push(createContactResp.contact)
					newData.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
					setOrganization({ ...organization, contacts: newData })
					result.status = 'success'
				}
				result.message = createContactResp.message
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
			variables: { body: contact },
			update(cache, { data }) {
				const updateContactResp = data.updateContact as ContactResponse
				if (updateContactResp.status === 'SUCCESS') {
					const newData = cloneDeep(organization.contacts) as Contact[]
					const contactIdx = newData.findIndex((c: Contact) => {
						return c.id === updateContactResp.contact.id
					})
					newData[contactIdx] = updateContactResp.contact
					setOrganization({ ...organization, contacts: newData })
					result.status = 'success'
				}

				result.message = updateContactResp.message
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
