/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import type {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerInput
} from '@cbosuite/schema/dist/client-types'
import { ServiceAnswerFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

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
// TODO: this is duplicated, needs to DRY'd
const GET_SERVICE_ANSWERS = gql`
	${ServiceAnswerFields}
	query GetServiceAnswers($serviceId: String!, $offset: Int, $limit: Int) {
		serviceAnswers(serviceId: $serviceId, offset: $offset, limit: $limit) {
			...ServiceAnswerFields
		}
	}
`

export type AddServiceAnswerCallback = (service: ServiceAnswerInput) => boolean

export function useAddServiceAnswerCallback(refetch: () => void): AddServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [addServiceAnswers] = useMutation<any, MutationCreateServiceAnswerArgs>(
		CREATE_SERVICE_ANSWERS
	)

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

				addServiceAnswers({
					variables: { serviceAnswer },
					optimisticResponse: {
						createServiceAnswer: {
							message: 'Success',
							serviceAnswer: {
								...serviceAnswer,
								id: crypto.randomUUID(),
								__typename: 'ServiceAnswer'
							},
							__typename: 'ServiceAnswerResponse'
						}
					},
					update: (cache, result) => {
						// optimisticResponse or serverResponse
						const newServiceAnswer = result.data.createServiceAnswer.serviceAnswer

						// const existingServiceAnswers = cache.readQuery({
						// 	 query: GET_SERVICE_ANSWERS,
						// 	 variables: { serviceId: serviceAnswer.serviceId },
						// })

						// Fetch all the activeEngagements
						const queryOptions = {
							query: GET_SERVICE_ANSWERS,
							variables: { serviceId: serviceAnswer.serviceId }
						}

						// Now we combine the newEngagement we passed in earlier with the existing data
						const addOptimisticResponse = (data) => {
							if (data) {
								return {
									serviceAnswers: [...data.serviceAnswers, newServiceAnswer]
								}
							}
						}

						cache.updateQuery(queryOptions, addOptimisticResponse)
						// refetch() // TODO: not sure refetch() does
					}
				})
				success(c('hooks.useServicelist.createAnswerSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.createAnswerFailed'))
				return false
			}
		},
		[c, success, failure, /*refetch,*/ addServiceAnswers]
	)
}
