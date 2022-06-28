/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useApolloClient, useMutation } from '@apollo/client'
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
import type { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'
import { GET_ORGANIZATION } from '../useOrganization'
import { CLIENT_SERVICE_ENTRY_ID_MAP } from '~hooks/api/useServiceAnswerList/useAddServiceAnswerCallback'
import { GET_SERVICE_ANSWERS } from '~hooks/api/useServiceAnswerList/useLoadServiceAnswersCallback'
import { useCurrentUser } from '../useCurrentUser'
import { useUpdateServiceAnswerCallback } from '~hooks/api/useServiceAnswerList/useUpdateServiceAnswerCallback'
import { updateServiceAnswerClient } from '~utils/serviceAnswers'
import { noop } from '~utils/noop'
import { LOCAL_ONLY_ID_PREFIX } from '~constants'

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

export interface AddedContactState {
	contact: Contact
	localId: string
}

export function useCreateContactCallback(): CreateContactCallback {
	const toast = useToasts()
	const { orgId } = useCurrentUser()
	const [createContactGQL] = useMutation<any, MutationCreateContactArgs>(CREATE_CONTACT)
	const [organization, setOrganization] = useRecoilState<Organization | null>(organizationState)
	const [, setAddedContact] = useRecoilState<AddedContactState | null>(addedContactState)
	const updateServiceAnswer = useUpdateServiceAnswerCallback(noop)

	const client = useApolloClient()

	return useCallback(
		(contact) => {
			let result: MessageResponse
			const newContactTempId = `${LOCAL_ONLY_ID_PREFIX}${crypto.randomUUID()}`

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
					// Get the offline status directly from local storage. If we try to use the isOffline hook here the status will be stale. We should try to refactor
					// so we can use the isOffline hook
					const isOfflineLocalStorage = localStorage.getItem('isOffline') ? true : false

					const hideSuccessToast =
						!isOfflineLocalStorage && resp.data?.createContact.contact.id === newContactTempId
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: hideSuccessToast
							? null
							: ({ createContact }: { createContact: ContactResponse }) => createContact.message,
						onSuccess: ({ createContact }: { createContact: ContactResponse }) => {
							// Get our client service answer id map so we can use it to determine if service answer needs to be updated
							const cachedClientServiceEntryIdMap = client.readQuery({
								query: CLIENT_SERVICE_ENTRY_ID_MAP
							})

							const clientServiceEntryIdMap = {
								...cachedClientServiceEntryIdMap?.clientServiceEntryIdMap
							}

							if (!createContact.contact.id.startsWith(LOCAL_ONLY_ID_PREFIX)) {
								// The response came from the server. Check if the corresponding locally created client is in our client/service answer map
								if (clientServiceEntryIdMap.hasOwnProperty(newContactTempId)) {
									const serviceAnswerForContact = clientServiceEntryIdMap[newContactTempId]

									if (!serviceAnswerForContact.id.startsWith(LOCAL_ONLY_ID_PREFIX)) {
										// The client is in our map, and we the server persisted service answer. So we can update the service answer with our
										// newly persisted client
										const queryOptions = {
											query: GET_SERVICE_ANSWERS,
											variables: { serviceId: serviceAnswerForContact.serviceId }
										}

										const existingServiceAnswers = cache.readQuery(queryOptions) as any

										const serviceAnswerToUpdate = existingServiceAnswers.serviceAnswers.find(
											(serviceAnswer) => serviceAnswer.id === serviceAnswerForContact.id
										)

										if (serviceAnswerToUpdate) {
											updateServiceAnswerClient(
												serviceAnswerToUpdate,
												createContact.contact.id,
												serviceAnswerForContact.serviceId,
												updateServiceAnswer
											)

											clientServiceEntryIdMap[newContactTempId] = null
										}
									} else {
										// We don't yet have the server persisted service answer, so update the map with the server persisted client id
										clientServiceEntryIdMap[createContact.contact.id] =
											clientServiceEntryIdMap[newContactTempId]
									}
								}

								client.writeQuery({
									query: CLIENT_SERVICE_ENTRY_ID_MAP,
									data: {
										clientServiceEntryIdMap: clientServiceEntryIdMap
									}
								})
							}

							// In kiosk mode, we haven't set this in the store as it would expose other client's data,
							// so we should not try to update it either as it'd cause an error.
							if (organization?.contacts) {
								setOrganization({
									...organization,
									contacts: [...organization.contacts, createContact.contact].sort(byFirstName)
								})
							}
							// however, we do need the new contact, especially when in that kiosk mode:

							// The createContactGQL mutation's update function gets called several times with the optimistic response after returning online
							// We don't want to update any forms with the new client in those cases. We also do not want to update any forms with newly created clients if we've
							// already used their optimistic response when submitting the form. So we need this complicated guard.
							if (
								(isOfflineLocalStorage &&
									createContact.contact.id.startsWith(LOCAL_ONLY_ID_PREFIX)) ||
								(!createContact.contact.id.startsWith(LOCAL_ONLY_ID_PREFIX) &&
									!clientServiceEntryIdMap.hasOwnProperty(newContactTempId))
							) {
								setAddedContact({ contact: createContact.contact, localId: newContactTempId })
							}

							// Update the cache with out optimistic response
							// optimisticResponse or serverResponse
							const newContact = resp.data.createContact.contact

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
										contacts: [...existingOrgData.organization.contacts, newContact].sort(
											byFirstName
										)
									}
								}
							})
							return createContact.message
						}
					})
				}
			})

			return result
		},
		[
			createContactGQL,
			organization,
			orgId,
			setAddedContact,
			setOrganization,
			toast,
			client,
			updateServiceAnswer
		]
	)
}

const byFirstName = (a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1)
