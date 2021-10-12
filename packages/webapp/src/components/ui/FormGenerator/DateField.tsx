/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswers, ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { DatePicker } from '@fluentui/react'
import React, { FC } from 'react'
import { useLocale } from '~hooks/useLocale'
import { FormFieldManager } from './FormFieldManager'
import { fieldStyles } from './styles'

export const DateField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	record: ServiceAnswers
	onChange: (submitEnabled: boolean) => void
}> = function DateField({ editMode, mgr, field, record, onChange }) {
	const [locale] = useLocale()
	let initialDate = new Date()

	if (editMode) {
		const currDateValue = record?.fieldAnswers[field.fieldType]?.find(
			(f) => f.fieldId === field.fieldId
		).values
		if (currDateValue) {
			initialDate = new Date(currDateValue)
		}
	}

	// prevent overwriting the date if the field is already filled
	if (!mgr.values[field.fieldType]) {
		mgr.saveFieldValue(field, initialDate.toISOString())
	} else {
		const index = mgr.values[field.fieldType].findIndex((f) => f.fieldId === field.fieldId)
		initialDate = new Date(mgr.values[field.fieldType][index].values)
	}

	return (
		<DatePicker
			allowTextInput
			label={field.fieldName}
			isRequired={field.fieldRequirements === 'required'}
			initialPickerDate={initialDate}
			formatDate={(date) => date.toLocaleDateString(locale)}
			value={initialDate}
			onSelectDate={(date: Date) => {
				mgr.saveFieldValue(field, new Date(date).toISOString())
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.datePicker}
		/>
	)
}
