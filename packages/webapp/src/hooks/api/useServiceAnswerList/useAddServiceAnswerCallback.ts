/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
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

export type AddServiceAnswerCallback = (service: ServiceAnswerInput) => Promise<boolean>

export function useAddServiceAnswerCallback(refetch: () => void): AddServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [addServiceAnswers] = useMutation<any, MutationCreateServiceAnswerArgs>(
		CREATE_SERVICE_ANSWERS
	)

	return useCallback(
		async (serviceAnswer: ServiceAnswerInput) => {
			try {
				await addServiceAnswers({ variables: { serviceAnswer } })
				refetch()
				success(c('hooks.useServicelist.createAnswerSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.createAnswerFailed'))
				return false
			}
		},
		[c, success, failure, refetch, addServiceAnswers]
	)
}
