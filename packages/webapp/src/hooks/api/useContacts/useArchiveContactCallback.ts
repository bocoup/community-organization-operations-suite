/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	MutationArchiveContactArgs,
	Organization,
	VoidResponse
} from '@cbosuite/schema/dist/client-types'
import { ContactStatus } from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { useToasts } from '~hooks/useToasts'
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const ARCHIVE_CONTACT = gql`
	mutation archiveContact($contactId: String!) {
		archiveContact(contactId: $contactId) {
			message
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
							setOrganization({
								...organization,
								contacts: organization.contacts.map((c) =>
									c.id === contactId ? { ...c, status: ContactStatus.Archived } : c
								)
							})
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
