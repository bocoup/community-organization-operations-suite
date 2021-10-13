/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { DatePicker } from '@fluentui/react'
import React, { FC, memo, useMemo } from 'react'
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
	const initialDate = useInitialDate(field, mgr, editMode)
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

function useInitialDate(field: ServiceCustomField, mgr: FormFieldManager, editMode: boolean): Date {
	return useMemo(() => {
		let initialDate: Date

		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const savedAnswer = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldValue(field, savedAnswer)
			initialDate = new Date(savedAnswer)
		} else if (mgr.isFieldValueRecorded(field)) {
			initialDate = new Date(mgr.getRecordedFieldValue(field))
		} else {
			initialDate = new Date()
			mgr.saveFieldValue(field, initialDate.toISOString())
		}
		return initialDate
	}, [field, mgr, editMode])
}
