/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service, ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { DeleteServiceAnswerCallback } from '~hooks/api/useServiceList/useDeleteServiceCallback'

export interface DeleteRecord {
	record: ServiceAnswers
	service: Service
}

export function useDeleteState(
	services: Service[],
	data: unknown[],
	setFilteredData: (data: unknown[]) => void,
	setUnfilteredData: (data: unknown[]) => void,
	deleteServiceAnswer: DeleteServiceAnswerCallback
) {
	const [isDeleteShown, { setTrue: showDeleteModal, setFalse: hideDelete }] = useBoolean(false)
	const [deleting, setDeleting] = useState<DeleteRecord | null>()

	const handleDelete = useCallback(
		(service: Service, record: ServiceAnswers) => {
			// Save the record to delete and open the confirmation modal
			setDeleting({ record, service })
			showDeleteModal()
		},
		[setDeleting, showDeleteModal]
	)

	const handleConfirmDelete = useCallback(
		async function handleConfirmDelete() {
			// delete the record from the drilled down list
			const currentAnswers = [...data] as ServiceAnswers[]
			const newAnswers = currentAnswers.filter((answer) => answer.id !== deleting.record.id)
			setFilteredData(newAnswers)

			const res = await deleteServiceAnswer({
				serviceId: deleting.service.id,
				answerId: deleting.record.id
			})

			if (res) {
				// delete the record from the unfiltered list
				const selectedService = services.find((s) => s.id === deleting.service.id)
				setUnfilteredData(selectedService.answers.filter((a) => a.id !== deleting.record.id))
			}

			// Hide modal
			hideDelete()
		},
		[data, services, deleting, hideDelete, deleteServiceAnswer, setFilteredData, setUnfilteredData]
	)

	return {
		isDeleteShown,
		hideDelete,
		handleDelete,
		handleConfirmDelete
	}
}
