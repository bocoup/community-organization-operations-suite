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

const LOCAL_ONLY_ID_PREFIX = 'LOCAL_'

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

	return useCallback(
		(_serviceAnswer: ServiceAnswerInput) => {
			try {
				const optimisticResponseId = `${LOCAL_ONLY_ID_PREFIX}${crypto.randomUUID()}`
				const serviceAnswerContacts = [..._serviceAnswer.contacts]

				const cachedMap = client.readQuery({
					query: CLIENT_SERVICE_ENTRY_ID_MAP
				})

				const myMap = { ...cachedMap?.clientServiceEntryIdMap }
				serviceAnswerContacts.forEach((contact) => {
					if (contact.startsWith(LOCAL_ONLY_ID_PREFIX)) {
						myMap[contact] = { id: optimisticResponseId, serviceId: _serviceAnswer.serviceId }
					}
				})

				client.writeQuery({
					query: CLIENT_SERVICE_ENTRY_ID_MAP,
					data: {
						clientServiceEntryIdMap: myMap
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
					contacts: _serviceAnswer.contacts.filter(
						(contact) => !contact.startsWith(LOCAL_ONLY_ID_PREFIX)
					)
				}

				// TODO: offline clients were not showing up, switched to updating recoil
				// const cachedOrganizations = client.readQuery({
				// 	query: GET_ORGANIZATION,
				// 	variables: { orgId }
				// })

				// The service answer we will use for our optimistic response. Need to ensure value and values are populated
				// when writing to the cache
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
						// optimisticResponse or serverResponse
						const newServiceAnswer = result.data.createServiceAnswer.serviceAnswer

						// update the SE with the client from the server
						if (!newServiceAnswer.id.startsWith(LOCAL_ONLY_ID_PREFIX)) {
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
								contactIds.forEach((contactId) => {
									if (!contactId.startsWith(LOCAL_ONLY_ID_PREFIX)) {
										updateServiceAnswerClient(
											newServiceAnswer,
											contactId,
											clientServiceEntryIdMap[contactId].serviceId,
											updateServiceAnswer
										)

										delete clientServiceEntryIdMap[contactId]
									} else {
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
