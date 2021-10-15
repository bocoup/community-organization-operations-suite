/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ServiceAnswer, ServiceAnswerInput } from '@cbosuite/schema/dist/client-types'
import { ServiceAnswerFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const UPDATE_SERVICE_ANSWER = gql`
	${ServiceAnswerFields}
	mutation UpdateServiceAnswer($body: ServiceAnswerInput!) {
		updateServiceAnswer(body: $body) {
			message
			status
			serviceAnswer {
				...ServiceAnswerFields
			}
		}
	}
`

export type UpdateServiceAnswerCallback = (
	serviceAnswer: ServiceAnswerInput
) => Promise<ServiceAnswer>

export function useUpdateServiceAnswerCallback(refetch: () => void): UpdateServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [updateService] = useMutation(UPDATE_SERVICE_ANSWER)

	return useCallback(
		async (serviceAnswer: ServiceAnswerInput) => {
			try {
				const result = await updateService({ variables: { body: serviceAnswer } })
				refetch()
				success(c('hooks.useServicelist.updateAnswerSuccess'))
				const answer = result.data?.updateServiceAnswer?.serviceAnswer
				return answer
			} catch (error) {
				failure(c('hooks.useServicelist.updateAnswerFailed'))
				return null
			}
		},
		[updateService, refetch, success, failure, c]
	)
}
