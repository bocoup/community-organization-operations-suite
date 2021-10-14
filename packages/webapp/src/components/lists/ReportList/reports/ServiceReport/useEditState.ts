/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import { UpdateServiceAnswerCallback } from '~hooks/api/useServiceAnswerList/useUpdateServiceAnswerCallback'

export interface EditRecord {
	record: ServiceAnswer
}

export function useEditState(
	data: unknown[],
	setUnfilteredData: (data: unknown[]) => void,
	updateServiceAnswer: UpdateServiceAnswerCallback
) {
	const [isEditShown, { setTrue: showEdit, setFalse: hideEdit }] = useBoolean(false)
	const [edited, setEdited] = useState<EditRecord | null>(null)

	const handleEdit = useCallback(
		function handleEdit(record: ServiceAnswer) {
			setEdited({ record })
			showEdit()
		},
		[showEdit, setEdited]
	)

	const handleUpdate = useCallback(
		async function handleUpdate(values) {
			const res = await updateServiceAnswer({ ...values, answerId: edited.record.id })

			if (res) {
				setUnfilteredData(data)

				const currentAnswers = [...data] as ServiceAnswer[]
				const newAnswers = currentAnswers.map((a) => {
					if (a.id === edited.record.id) {
						return { ...a, fieldAnswers: values.fieldAnswers }
					}
					return a
				})
				setUnfilteredData(newAnswers)
				hideEdit()
			}
		},
		[hideEdit, data, edited, setUnfilteredData, updateServiceAnswer]
	)

	return {
		edited,
		isEditShown,
		hideEdit,
		handleEdit,
		handleUpdate
	}
}
