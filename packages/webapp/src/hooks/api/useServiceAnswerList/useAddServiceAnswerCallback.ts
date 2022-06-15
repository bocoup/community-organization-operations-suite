/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerInput,
	Organization
} from '@cbosuite/schema/dist/client-types'
import { ServiceAnswerFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { GET_SERVICE_ANSWERS } from './useLoadServiceAnswersCallback'
// import { GET_ORGANIZATION } from '../useOrganization'
import { useCallback } from 'react'
// import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'

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

export type AddServiceAnswerCallback = (service: ServiceAnswerInput) => boolean

export function useAddServiceAnswerCallback(refetch: () => void): AddServiceAnswerCallback {
	const { c } = useTranslation()
	// const { orgId } = useCurrentUser()
	const { success, failure } = useToasts()
	const [organization] = useRecoilState<Organization | null>(organizationState)
	const [addServiceAnswers] = useMutation<any, MutationCreateServiceAnswerArgs>(
		CREATE_SERVICE_ANSWERS
	)
	// const client = useApolloClient()

	return useCallback(
		(_serviceAnswer: ServiceAnswerInput) => {
			try {
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
					})
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
					contacts: _serviceAnswer.contacts.map((contactId) => {
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
								id: crypto.randomUUID(),
								__typename: 'ServiceAnswer'
							},
							__typename: 'ServiceAnswerResponse'
						}
					},
					update: (cache, result) => {
						// optimisticResponse or serverResponse
						const newServiceAnswer = result.data.createServiceAnswer.serviceAnswer

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
		[c, success, failure, refetch, addServiceAnswers, organization]
	)
}
