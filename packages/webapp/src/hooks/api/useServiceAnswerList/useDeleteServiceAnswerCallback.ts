/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { ServiceAnswerIdInput } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

const DELETE_SERVICE_ANSWER = gql`
	mutation deleteServiceAnswer($body: ServiceAnswerIdInput!) {
		deleteServiceAnswer(body: $body) {
			message
			status
		}
	}
`

export type DeleteServiceAnswerCallback = (serviceAnswer: ServiceAnswerIdInput) => Promise<boolean>

export function useDeleteServiceAnswerCallback(refetch: () => void): DeleteServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [removeServiceAnswer] = useMutation(DELETE_SERVICE_ANSWER)

	return useCallback(
		async (serviceAnswer: ServiceAnswerIdInput) => {
			try {
				await removeServiceAnswer({ variables: { body: serviceAnswer } })
				refetch()
				success(c('hooks.useServicelist.deleteAnswerSuccess'))
				return true
			} catch (error) {
				failure(c('hooks.useServicelist.deleteAnswerFailed'))
				return false
			}
		},
		[refetch, removeServiceAnswer, success, failure, c]
	)
}
