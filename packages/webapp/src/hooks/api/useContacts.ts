/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	Contact,
	ContactInput,
	ContactResponse,
	ContactStatus,
	Organization,
	StatusType,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'
import { ContactFields } from './fragments'
import { useToasts } from '~hooks/useToasts'
import { MessageResponse } from '.'

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

export const ARCHIVE_CONTACT = gql`
	mutation archiveContact($body: ContactIdInput!) {
		archiveContact(body: $body) {
			message
			status
		}
	}
`

interface useContactReturn {
	contacts: Contact[]
	createContact: (contact: ContactInput) => Promise<MessageResponse>
	updateContact: (contact: ContactInput) => Promise<MessageResponse>
	archiveContact: (contactId: string) => Promise<MessageResponse>
}

export function useContacts(): useContactReturn {
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const { success, failure } = useToasts()

	const [createContactGQL] = useMutation(CREATE_CONTACT)
	const [updateContactGQL] = useMutation(UPDATE_CONTACT)
	const [archiveContactGQL] = useMutation(ARCHIVE_CONTACT)

	const createContact: useContactReturn['createContact'] = async (contact) => {
		const result: MessageResponse = { status: StatusType.Failed }
		await createContactGQL({
			variables: { body: contact },
			update(cache, { data }) {
				const createContactResp = data.createContact as ContactResponse
				if (createContactResp.status === StatusType.Success) {
					const newData = cloneDeep(organization.contacts) as Contact[]
					newData.push(createContactResp.contact)
					newData.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
					setOrganization({ ...organization, contacts: newData })
					result.status = StatusType.Success

					success(createContactResp.message)
				} else {
					failure(createContactResp.message)
				}
				result.message = createContactResp.message
			}
		})

		return result
	}

	const updateContact: useContactReturn['updateContact'] = async (contact) => {
		const result: MessageResponse = { status: StatusType.Failed }
		await updateContactGQL({
			variables: { body: contact },
			update(cache, { data }) {
				const updateContactResp = data.updateContact as ContactResponse
				if (updateContactResp.status === StatusType.Success) {
					const newData = cloneDeep(organization.contacts) as Contact[]
					const contactIdx = newData.findIndex((c: Contact) => {
						return c.id === updateContactResp.contact.id
					})
					newData[contactIdx] = updateContactResp.contact
					setOrganization({ ...organization, contacts: newData })
					result.status = StatusType.Success
					success(updateContactResp.message)
				} else {
					failure(updateContactResp.message)
				}

				result.message = updateContactResp.message
			}
		})

		return result
	}

	const archiveContact: useContactReturn['archiveContact'] = async (contactId) => {
		const result: MessageResponse = { status: StatusType.Failed }

		await archiveContactGQL({
			variables: { body: { contactId } },
			update(cache, { data }) {
				const archiveContactResp = data.archiveContact as VoidResponse
				if (archiveContactResp.status === StatusType.Success) {
					// Set the local contact status to archived
					const nextContacts = cloneDeep(organization.contacts) as Contact[]
					const contactIdx = nextContacts.findIndex((c: Contact) => {
						return c.id === contactId
					})
					nextContacts[contactIdx].status = ContactStatus.Archived

					setOrganization({ ...organization, contacts: nextContacts })
					result.status = StatusType.Success
					success(archiveContactResp.message)
				} else {
					failure(archiveContactResp.message)
				}

				result.message = archiveContactResp.message
			}
		})

		return result
	}

	return {
		contacts: organization?.contacts || [],
		createContact,
		updateContact,
		archiveContact
	}
}
