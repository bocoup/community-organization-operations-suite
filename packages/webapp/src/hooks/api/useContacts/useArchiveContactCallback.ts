/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	Contact,
	ContactStatus,
	Organization,
	StatusType,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'
import { useToasts } from '~hooks/useToasts'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const ARCHIVE_CONTACT = gql`
	mutation archiveContact($contactId: String!) {
		archiveContact(contactId: $contactId) {
			message
			status
		}
	}
`
export type ArchiveContactCallback = (contactId: string) => Promise<MessageResponse>

export function useArchiveContactCallback(): ArchiveContactCallback {
	const { success, failure } = useToasts()
	const [archiveContactGQL] = useMutation(ARCHIVE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (contactId) => {
			const result: MessageResponse = { status: StatusType.Failed }

			await archiveContactGQL({
				variables: { contactId },
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
		},
		[success, failure, archiveContactGQL, organization, setOrganization]
	)
}
