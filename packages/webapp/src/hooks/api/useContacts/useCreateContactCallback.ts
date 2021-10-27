/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	Contact,
	ContactInput,
	ContactResponse,
	MutationCreateContactArgs,
	Organization,
	StatusType
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { cloneDeep } from 'lodash'
import { ContactFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { MessageResponse } from '../types'
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
			status
		}
	}
`

export type CreateContactCallback = (contact: ContactInput) => Promise<MessageResponse>

export function useCreateContactCallback(): CreateContactCallback {
	const toast = useToasts()
	const [createContactGQL] = useMutation<any, MutationCreateContactArgs>(CREATE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (contact) => {
			let result: MessageResponse = { status: StatusType.Failed }
			await createContactGQL({
				variables: { contact },
				update(_cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: ({ createContact }: { createContact: ContactResponse }) =>
							createContact.message,
						onSuccess: ({ createContact }: { createContact: ContactResponse }) => {
							const newData = cloneDeep(organization.contacts) as Contact[]
							newData.push(createContact.contact)
							newData.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
							setOrganization({ ...organization, contacts: newData })
							return createContact.message
						}
					})
				}
			})

			return result
		},
		[createContactGQL, organization, setOrganization, toast]
	)
}
