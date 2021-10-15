/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service } from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo } from 'react'
import { useServiceAnswerList } from '~hooks/api/useServiceAnswerList'

export function useServiceReportData(
	service: Service,
	setUnfilteredData: (data: unknown[]) => void,
	setFilteredData: (data: unknown[]) => void
) {
	const { data, loading, updateServiceAnswer, deleteServiceAnswer } = useServiceAnswerList(
		service.id
	)
	useEffect(
		function initializeData() {
			setUnfilteredData(data)
			setFilteredData(data)
		},
		[service, data, setUnfilteredData, setFilteredData]
	)

	return useMemo(
		() => ({ loading, updateServiceAnswer, deleteServiceAnswer }),
		[loading, updateServiceAnswer, deleteServiceAnswer]
	)
}
