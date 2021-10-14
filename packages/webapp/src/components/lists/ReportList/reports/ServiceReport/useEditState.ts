/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service, ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { UpdateServiceAnswerCallback } from '~hooks/api/useServiceList/useUpdateServiceAnswerCallback'

export interface EditRecord {
	service: Service
	record: ServiceAnswers
}

export function useEditState(
	services: Service[],
	data: unknown[],
	setFilteredData: (data: unknown[]) => void,
	setUnfilteredData: (data: unknown[]) => void,
	updateServiceAnswer: UpdateServiceAnswerCallback
) {
	const [isEditShown, { setTrue: showEdit, setFalse: hideEdit }] = useBoolean(false)
	const [edited, setEdited] = useState<EditRecord | null>(null)

	const handleEdit = useCallback(
		function handleEdit(service: Service, record: ServiceAnswers) {
			setEdited({ service, record })
			showEdit()
		},
		[showEdit, setEdited]
	)

	const handleUpdate = useCallback(
		async function handleUpdate(values) {
			const res = await updateServiceAnswer({ ...values, answerId: edited.record.id })

			if (res) {
				const selectedService = services.find((s) => s.id === edited.service.id)
				setUnfilteredData(selectedService.answers)

				const currentAnswers = [...data] as ServiceAnswers[]
				const newAnswers = currentAnswers.map((a) => {
					if (a.id === edited.record.id) {
						return { ...a, fieldAnswers: values.fieldAnswers }
					}
					return a
				})
				setFilteredData(newAnswers)
				hideEdit()
			}
		},
		[hideEdit, data, edited, setFilteredData, setUnfilteredData, services, updateServiceAnswer]
	)

	return {
		edited,
		isEditShown,
		hideEdit,
		handleEdit,
		handleUpdate
	}
}
