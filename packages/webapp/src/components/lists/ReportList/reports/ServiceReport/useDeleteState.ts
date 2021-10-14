/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { DeleteServiceAnswerCallback } from '~hooks/api/useServiceList/useDeleteServiceCallback'

export interface DeleteRecord {
	record: ServiceAnswer
}

export function useDeleteState(
	data: unknown[],
	setFilteredData: (data: unknown[]) => void,
	setUnfilteredData: (data: unknown[]) => void,
	deleteServiceAnswer: DeleteServiceAnswerCallback
) {
	const [isDeleteShown, { setTrue: showDeleteModal, setFalse: hideDelete }] = useBoolean(false)
	const [deleting, setDeleting] = useState<DeleteRecord | null>()

	const handleDelete = useCallback(
		(record: ServiceAnswer) => {
			// Save the record to delete and open the confirmation modal
			setDeleting({ record })
			showDeleteModal()
		},
		[setDeleting, showDeleteModal]
	)

	const handleConfirmDelete = useCallback(
		async function handleConfirmDelete() {
			// delete the record from the drilled down list
			const currentAnswers = [...data] as ServiceAnswer[]
			const newAnswers = currentAnswers.filter((answer) => answer.id !== deleting.record.id)
			setFilteredData(newAnswers)

			const res = await deleteServiceAnswer({
				answerId: deleting.record.id
			})

			if (res) {
				// delete the record from the unfiltered list
				setUnfilteredData(data.filter((a) => (a as ServiceAnswer).id !== deleting.record.id))
			}

			// Hide modal
			hideDelete()
		},
		[data, deleting, hideDelete, deleteServiceAnswer, setFilteredData, setUnfilteredData]
	)

	return {
		isDeleteShown,
		hideDelete,
		handleDelete,
		handleConfirmDelete
	}
}
