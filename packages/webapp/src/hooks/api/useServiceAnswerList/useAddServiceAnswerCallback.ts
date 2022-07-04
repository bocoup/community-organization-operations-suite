/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useApolloClient, useMutation } from '@apollo/client'
import type {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerInput,
	Organization
} from '@cbosuite/schema/dist/client-types'
import { ServiceAnswerFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useUpdateServiceAnswerCallback } from '~hooks/api/useServiceAnswerList/useUpdateServiceAnswerCallback'
import { GET_SERVICE_ANSWERS } from './useLoadServiceAnswersCallback'
import { updateServiceAnswerClient } from '~utils/serviceAnswers'
import { useCallback } from 'react'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { noop } from '~utils/noop'
import { LOCAL_ONLY_ID_PREFIX } from '~constants'

const CREATE_SERVICE_ANSWERS = gql`
	${ServiceAnswerFields}

	mutation createServiceAnswer($serviceAnswer: ServiceAnswerInput!) {
		createServiceAnswer(serviceAnswer: $serviceAnswer) {
			message
			serviceAnswer {
				...ServiceAnswerFields
			}
		}
	}
`

export const CLIENT_SERVICE_ENTRY_ID_MAP = gql`
	query clientServiceEntryIdMap {
		clientServiceEntryIdMap @client
	}
`

export type AddServiceAnswerCallback = (service: ServiceAnswerInput) => boolean

export function useAddServiceAnswerCallback(refetch: () => void): AddServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [organization] = useRecoilState<Organization | null>(organizationState)
	const [addServiceAnswers] = useMutation<any, MutationCreateServiceAnswerArgs>(
		CREATE_SERVICE_ANSWERS
	)
	const client = useApolloClient()
	const updateServiceAnswer = useUpdateServiceAnswerCallback(noop)

	// When service entries with new clients are created offline we can't add the persisted client to the service answer when sending the service request since we don't
	// yet have the persisted client (when offline requests get queued and we don't yet have the ability to wait for create client requests to return before sending
	// create service answer requests). So in order to link persisted service entries with the persisted client we create the service request without the client and
	// we keep a map of locally created service entries with locally created clients and when the persisted entities are returned from he server we use the map to
	// and update persisted service entries with the proper persisted clients. This solution is rather complicated. It would be better if we could manage the request
	// queues so that service answer requests would wait for client creation requests to return. Then the service answer request could be properly constructed
	return useCallback(
		(_serviceAnswer: ServiceAnswerInput) => {
			try {
				const optimisticResponseId = `${LOCAL_ONLY_ID_PREFIX}${crypto.randomUUID()}`
				const serviceAnswerContacts = [..._serviceAnswer.contacts]

				// if the service answer has any contacts with a local id prefix that means the client has not yet been persisted to the server (ie it was created while offline).
				// so we need to store a map of the local client id to the service answer id so that when we do have server persisted client it can be added to the service answer

				// We keep a map of { local client id: {service answer id, service id}} to track service entries that will need to be updated
				const clientServiceEntryIdMapQueryResult = client.readQuery({
					query: CLIENT_SERVICE_ENTRY_ID_MAP
				})
				const clientServiceEntryIdMap = {
					...clientServiceEntryIdMapQueryResult?.clientServiceEntryIdMap
				}
				serviceAnswerContacts.forEach((contact) => {
					if (contact.startsWith(LOCAL_ONLY_ID_PREFIX)) {
						// The service answer has a local client, add it to the map
						clientServiceEntryIdMap[contact] = {
							id: optimisticResponseId,
							serviceId: _serviceAnswer.serviceId
						}
					}
				})
				client.writeQuery({
					query: CLIENT_SERVICE_ENTRY_ID_MAP,
					data: {
						clientServiceEntryIdMap: clientServiceEntryIdMap
					}
				})

				// Filter out empty answers
				const serviceAnswer = {
					..._serviceAnswer,
					fields: _serviceAnswer.fields.map((field) => {
						const f = field

						// Single field value
						if (typeof field.value !== 'undefined' && !field.value) f.value = ''

						// Multi field value
						if (typeof field.values !== 'undefined' && !field.values) f.values = []

						return f
					}),
					// Remove any non persisted clients so we don't get server errors about not being able to find the client
					contacts: _serviceAnswer.contacts.filter(
						(contact) => !contact.startsWith(LOCAL_ONLY_ID_PREFIX)
					)
				}

				// TODO: I tried to use the cache to get offline created clients but they were not present is the response from this query. So I resorted to using recoil.
				// I left this code here so it can be investigated at a later date
				// const cachedOrganizations = client.readQuery({
				// 	query: GET_ORGANIZATION,
				// 	variables: { orgId }
				// })

				// The service answer we will use for our optimistic response. Need to ensure value and values are populated
				// when writing to the cache. This optimistic response will be added to the cache and eventually updated with the server response
				const optimisticServiceAnswer = {
					..._serviceAnswer,
					fields: _serviceAnswer.fields.map((field) => {
						const f = field

						// Single field value
						if (typeof field.value === 'undefined') f.value = null

						// Multi field value
						if (typeof field.values === 'undefined') f.values = null

						return f
					}),
					contacts: serviceAnswerContacts.map((contactId) => {
						const contact = organization.contacts.find((contact) => contact.id === contactId)

						// TODO: see comment above regarding cached clients
						// const cachedContact = cachedOrganizations?.organization.contacts.find(
						// 	(contact) => contact.id === contactId
						// )

						return contact
					})
				}

				addServiceAnswers({
					variables: { serviceAnswer },
					optimisticResponse: {
						createServiceAnswer: {
							message: 'Success',
							serviceAnswer: {
								...optimisticServiceAnswer,
								id: optimisticResponseId,
								__typename: 'ServiceAnswer'
							},
							__typename: 'ServiceAnswerResponse'
						}
					},
					update: (cache, result) => {
						// newServiceAnswer is either optimisticResponse or serverResponse
						const newServiceAnswer = result.data.createServiceAnswer.serviceAnswer

						if (!newServiceAnswer.id.startsWith(LOCAL_ONLY_ID_PREFIX)) {
							// The result contains a server response. Check if we need to update the service answer with a server persisted client
							// (ie at the time of creation the service answer we only had a locally persisted client)

							// look up the service answer in our map, using tbe optimistic response local id
							const cachedMap = client.readQuery({
								query: CLIENT_SERVICE_ENTRY_ID_MAP
							})

							const clientServiceEntryIdMap = { ...cachedMap?.clientServiceEntryIdMap }

							const contactIds = Object.keys(clientServiceEntryIdMap).filter(
								(contactId) =>
									clientServiceEntryIdMap[contactId] &&
									clientServiceEntryIdMap[contactId].id === optimisticResponseId
							)

							if (contactIds) {
								// This service answer was created with local clients. Check if we now have the server persisted versions of those clients, and update the service
								// answer if we do
								contactIds.forEach((contactId) => {
									if (!contactId.startsWith(LOCAL_ONLY_ID_PREFIX)) {
										// We do have the server persisted client, so update the service answer
										updateServiceAnswerClient(
											newServiceAnswer,
											contactId,
											clientServiceEntryIdMap[contactId].serviceId,
											updateServiceAnswer
										)

										delete clientServiceEntryIdMap[contactId]
									} else {
										// We don't yet have the server persisted client, so update our map with the server persisted service answer, so the service answer can
										// be updated once we have the server persisted client
										clientServiceEntryIdMap[contactId] = {
											id: newServiceAnswer.id,
											serviceId: clientServiceEntryIdMap[contactId].serviceId
										}
									}
								})
							}

							client.writeQuery({
								query: CLIENT_SERVICE_ENTRY_ID_MAP,
								data: {
									clientServiceEntryIdMap: clientServiceEntryIdMap
								}
							})
						}

						// Fetch all the service answers
						const queryOptions = {
							query: GET_SERVICE_ANSWERS,
							variables: { serviceId: serviceAnswer.serviceId }
						}

						// Now we combine the new service answer we passed in earlier with the existing service answers
						const addOptimisticResponse = (data) => {
							if (data) {
								return {
									serviceAnswers: [...data.serviceAnswers, newServiceAnswer]
								}
							}
						}

						// Update the cache
						cache.updateQuery(queryOptions, addOptimisticResponse)
					}
				}).then(() => {
					refetch()
				})
				success(c('hooks.useServicelist.createAnswerSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.createAnswerFailed'))
				return false
			}
		},
		[c, success, failure, refetch, addServiceAnswers, organization, client, updateServiceAnswer]
	)
}
