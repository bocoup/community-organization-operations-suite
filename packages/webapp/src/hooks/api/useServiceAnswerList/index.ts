/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import type { DeleteServiceAnswerCallback } from './useDeleteServiceAnswerCallback'
import { useDeleteServiceAnswerCallback } from './useDeleteServiceAnswerCallback'
import type { AddServiceAnswerCallback } from './useAddServiceAnswerCallback'
import { useAddServiceAnswerCallback } from './useAddServiceAnswerCallback'
import type { UpdateServiceAnswerCallback } from './useUpdateServiceAnswerCallback'
import { useUpdateServiceAnswerCallback } from './useUpdateServiceAnswerCallback'
import { useLoadServiceAnswersCallback } from './useLoadServiceAnswersCallback'
import type { ServiceAnswer } from '@cbosuite/schema/dist/client-types'

export function useServiceAnswerList(serviceId?: string): {
	data: ServiceAnswer[] | null
	loading: boolean
	addServiceAnswer: AddServiceAnswerCallback
	updateServiceAnswer: UpdateServiceAnswerCallback
	deleteServiceAnswer: DeleteServiceAnswerCallback
} {
	const { data, loading, refetch } = useLoadServiceAnswersCallback(serviceId)
	const addServiceAnswer = useAddServiceAnswerCallback(refetch)
	const updateServiceAnswer = useUpdateServiceAnswerCallback(refetch)
	const deleteServiceAnswer = useDeleteServiceAnswerCallback(refetch)

	return useMemo(
		() => ({
			data,
			loading,
			addServiceAnswer,
			updateServiceAnswer,
			deleteServiceAnswer
		}),
		[data, loading, addServiceAnswer, updateServiceAnswer, deleteServiceAnswer]
	)
}
