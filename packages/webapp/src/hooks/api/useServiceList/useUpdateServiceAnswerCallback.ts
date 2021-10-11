/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ServiceAnswerInput } from '@cbosuite/schema/dist/client-types'
import { ServiceFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { useCallback } from 'react'

const UPDATE_SERVICE_ANSWER = gql`
	${ServiceFields}

	mutation updateServiceAnswer($body: ServiceAnswerInput!) {
		updateServiceAnswer(body: $body) {
			message
			status
			service {
				...ServiceFields
			}
		}
	}
`

export type UpdateServiceAnswerCallback = (serviceAnswer: ServiceAnswerInput) => Promise<boolean>

export function useUpdateServiceAnswerCallback(load: () => void): UpdateServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [updateService] = useMutation(UPDATE_SERVICE_ANSWER)

	return useCallback(
		async (serviceAnswer: ServiceAnswerInput) => {
			try {
				await updateService({ variables: { body: serviceAnswer } })
				load()
				success(c('hooks.useServicelist.updateAnswerSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.updateAnswerFailed'))
				return false
			}
		},
		[updateService, load, success, failure, c]
	)
}
