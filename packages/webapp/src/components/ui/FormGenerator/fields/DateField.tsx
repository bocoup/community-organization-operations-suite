/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ServiceField } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'
import { DatePicker } from '@fluentui/react'
import type { FC } from 'react'
import React, { memo, useMemo } from 'react'
import { useLocale } from '~hooks/useLocale'
import type { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const DateField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceField
	onChange: (submitEnabled: boolean) => void
}> = memo(function DateField({ editMode, mgr, field, onChange }) {
	const [locale] = useLocale()
	const initialDate = useInitialDate(field, mgr, editMode)
	return (
		<DatePicker
			allowTextInput
			label={field.name}
			isRequired={field.requirement === ServiceFieldRequirement.Required}
			initialPickerDate={initialDate}
			formatDate={(date) => date.toLocaleDateString(locale)}
			value={initialDate}
			onSelectDate={(date: Date) => {
				mgr.saveFieldSingleValue(field, date ? new Date(date).toISOString() : undefined)
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.datePicker}
		/>
	)
})

function useInitialDate(field: ServiceField, mgr: FormFieldManager, editMode: boolean): Date {
	return useMemo(() => {
		let initialDate: Date

		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const savedAnswer = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldSingleValue(field, savedAnswer)
			initialDate = new Date(savedAnswer)
		} else if (mgr.isFieldValueRecorded(field)) {
			initialDate = new Date(mgr.getRecordedFieldValue(field) as string)
		} else {
			initialDate = undefined
			mgr.saveFieldSingleValue(field, undefined)
		}
		return initialDate
	}, [field, mgr, editMode])
}
