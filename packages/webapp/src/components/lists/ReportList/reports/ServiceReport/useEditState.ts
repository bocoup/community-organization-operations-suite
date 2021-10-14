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
			const updated = await updateServiceAnswer({ ...values, id: edited.record.id })

			if (updated) {
				setUnfilteredData(
					data.map((d: ServiceAnswer) => {
						if (d.id === edited.record.id) {
							return updated
						} else {
							return d
						}
					})
				)

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
