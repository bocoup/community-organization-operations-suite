/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { DatePicker } from '@fluentui/react'
import React, { FC, memo } from 'react'
import { useLocale } from '~hooks/useLocale'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const DateField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function DateField({ editMode, mgr, field, onChange }) {
	const [locale] = useLocale()
	let initialDate = new Date()

	if (editMode) {
		const currDateValue = mgr.getAnsweredFieldValue(field)
		if (currDateValue) {
			initialDate = new Date(currDateValue)
		}
	}

	// prevent overwriting the date if the field is already filled
	if (!mgr.isFieldValueRecorded(field)) {
		mgr.saveFieldValue(field, initialDate.toISOString())
	} else {
		initialDate = new Date(mgr.getRecordedFieldValue(field))
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
})
