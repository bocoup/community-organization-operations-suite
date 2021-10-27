/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	Contact,
	ContactStatus,
	MutationArchiveContactArgs,
	Organization,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'
import { useToasts } from '~hooks/useToasts'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

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
	const toast = useToasts()
	const [archiveContactGQL] = useMutation<any, MutationArchiveContactArgs>(ARCHIVE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (contactId) => {
			let result: MessageResponse

			await archiveContactGQL({
				variables: { contactId },
				update(_cache, response) {
					result = handleGraphqlResponseSync(response, {
						toast,
						onSuccess: ({ archiveContact }: { archiveContact: VoidResponse }) => {
							// Set the local contact status to archived
							const nextContacts = cloneDeep(organization.contacts) as Contact[]
							const contactIdx = nextContacts.findIndex((c: Contact) => {
								return c.id === contactId
							})
							nextContacts[contactIdx].status = ContactStatus.Archived
							setOrganization({ ...organization, contacts: nextContacts })
							return archiveContact.message
						}
					})
				}
			})

			return result
		},
		[toast, archiveContactGQL, organization, setOrganization]
	)
}
