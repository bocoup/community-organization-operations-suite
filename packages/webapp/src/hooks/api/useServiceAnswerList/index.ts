/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import {
	DeleteServiceAnswerCallback,
	useDeleteServiceAnswerCallback
} from './useDeleteServiceAnswerCallback'
import {
	AddServiceAnswerCallback,
	useAddServiceAnswerCallback
} from './useAddServiceAnswerCallback'
import {
	UpdateServiceAnswerCallback,
	useUpdateServiceAnswerCallback
} from './useUpdateServiceAnswerCallback'
import { useLoadServiceAnswersCallback } from './useLoadServiceAnswersCallback'
import { ServiceAnswer } from '@cbosuite/schema/dist/client-types'

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
