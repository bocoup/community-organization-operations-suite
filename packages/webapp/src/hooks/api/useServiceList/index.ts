/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Service } from '@cbosuite/schema/dist/client-types'
import { serviceListState } from '~store'
import type { ApiResponse } from '../types'
import { useRecoilValue } from 'recoil'
import { useLoadServicesCallback } from './useLoadServicesCallback'
import type { UpdateServiceCallback } from './useUpdateServiceCallback'
import { useUpdateServiceCallback } from './useUpdateServiceCallback'
import type { AddServiceCallback } from './useAddServiceCallback'
import { useAddServiceCallback } from './useAddServiceCallback'
import { empty } from '~utils/noop'
import { useMemo } from 'react'

interface useServiceListReturn extends ApiResponse<Service[]> {
	serviceList: Service[]
	addNewService: AddServiceCallback
	updateService: UpdateServiceCallback
}

export function useServiceList(orgId?: string): useServiceListReturn {
	const serviceList = useRecoilValue<Service[]>(serviceListState)
	const { load, loading, error, refetch, fetchMore } = useLoadServicesCallback(orgId)
	const addNewService = useAddServiceCallback(load)
	const updateService = useUpdateServiceCallback(load)

	return useMemo(
		() => ({
			loading,
			error,
			refetch,
			fetchMore,
			serviceList: serviceList || empty,
			addNewService,
			updateService
		}),
		[loading, error, refetch, fetchMore, serviceList, addNewService, updateService]
	)
}
