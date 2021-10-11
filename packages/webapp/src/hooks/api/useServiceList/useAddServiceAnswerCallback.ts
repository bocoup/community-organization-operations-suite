/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ServiceInput } from '@cbosuite/schema/dist/client-types'
import { ServiceFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const CREATE_SERVICE_ANSWERS = gql`
	${ServiceFields}

	mutation createServiceAnswers($body: ServiceAnswerInput!) {
		createServiceAnswers(body: $body) {
			message
			status
			service {
				...ServiceFields
			}
		}
	}
`

export type AddServiceAnswerCallback = (service: ServiceInput) => Promise<boolean>

export function useAddServiceAnswerCallback(load: () => void): AddServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [addServiceAnswers] = useMutation(CREATE_SERVICE_ANSWERS)

	return useCallback(async (serviceAnswer: ServiceInput) => {
		try {
			await addServiceAnswers({ variables: { body: serviceAnswer } })
			load()
			success(c('hooks.useServicelist.createAnswerSuccess'))
			return true
		} catch (error) {
			failure(c('hooks.useServicelist.createAnswerFailed'))
			return false
		}
	}, [])
}
