/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	Contact,
	ContactInput,
	ContactResponse,
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

const UPDATE_CONTACT = gql`
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
export type UpdateContactCallback = (contact: ContactInput) => Promise<MessageResponse>

export function useUpdateContactCallback(): UpdateContactCallback {
	const { success, failure } = useToasts()
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const [updateContactGQL] = useMutation(UPDATE_CONTACT)

	return useCallback(
		async (contact) => {
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
		},
		[success, failure, organization, setOrganization, updateContactGQL]
	)
}
