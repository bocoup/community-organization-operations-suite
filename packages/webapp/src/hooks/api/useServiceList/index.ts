/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Service } from '@cbosuite/schema/dist/client-types'
import { serviceListState } from '~store'
import { ApiResponse } from '../types'
import { useRecoilValue } from 'recoil'
import { useLoadServicesCallback } from './useLoadServicesCallback'
import {
	UpdateServiceAnswerCallback,
	useUpdateServiceAnswerCallback
} from './useUpdateServiceAnswerCallback'
import { DeleteServiceCallback, useDeleteServiceCallback } from './useDeleteServiceCallback'
import {
	AddServiceAnswerCallback,
	useAddServiceAnswerCallback
} from './useAddServiceAnswerCallback'
import { UpdateServiceCallback, useUpdateServiceCallback } from './useUpdateServiceCallback'
import { AddServiceCallback, useAddServiceCallback } from './useAddServiceCallback'
import { empty } from '~utils/noop'
import { useMemo } from 'react'

interface useServiceListReturn extends ApiResponse<Service[]> {
	serviceList: Service[]
	addNewService: AddServiceCallback
	updateService: UpdateServiceCallback
	addServiceAnswer: AddServiceAnswerCallback
	updateServiceAnswer: UpdateServiceAnswerCallback
	deleteServiceAnswer: DeleteServiceCallback
}

export function useServiceList(orgId?: string): useServiceListReturn {
	const serviceList = useRecoilValue<Service[]>(serviceListState)
	const { load, loading, error, refetch, fetchMore } = useLoadServicesCallback(orgId)
	const addNewService = useAddServiceCallback(load)
	const updateService = useUpdateServiceCallback(load)
	const addServiceAnswer = useAddServiceAnswerCallback(load)
	const deleteServiceAnswer = useDeleteServiceCallback(load)
	const updateServiceAnswer = useUpdateServiceAnswerCallback(load)

	return useMemo(
		() => ({
			loading,
			error,
			refetch,
			fetchMore,
			serviceList: serviceList || empty,
			addNewService,
			updateService,
			addServiceAnswer,
			updateServiceAnswer,
			deleteServiceAnswer
		}),
		[
			loading,
			error,
			refetch,
			fetchMore,
			serviceList,
			addNewService,
			updateService,
			addServiceAnswer,
			updateServiceAnswer,
			deleteServiceAnswer
		]
	)
}
