/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationDeleteServiceAnswerArgs } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

const DELETE_SERVICE_ANSWER = gql`
	mutation deleteServiceAnswer($answerId: String!) {
		deleteServiceAnswer(answerId: $answerId) {
			message
		}
	}
`

export type DeleteServiceAnswerCallback = (id: string) => Promise<boolean>

export function useDeleteServiceAnswerCallback(refetch: () => void): DeleteServiceAnswerCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [removeServiceAnswer] = useMutation<any, MutationDeleteServiceAnswerArgs>(
		DELETE_SERVICE_ANSWER
	)

	return useCallback(
		async (answerId: string) => {
			try {
				await removeServiceAnswer({ variables: { answerId } })
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
