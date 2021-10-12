/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import React, { FC, FocusEvent, memo, useMemo } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const MultiLineTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function MultiLineTextField({ editMode, mgr, field, onChange }) {
	const fieldValue = useInitialFieldValue(field, mgr, editMode)
	return (
		<TextField
			label={field.fieldName}
			defaultValue={fieldValue}
			autoAdjustHeight
			multiline
			required={field.fieldRequirements === 'required'}
			onBlur={(e: FocusEvent<HTMLInputElement>) => {
				mgr.saveFieldValue(field, e.target.value)
				mgr.clearFieldError(field.fieldId)
				onChange(mgr.isSubmitEnabled())
			}}
			onChange={(e: FocusEvent<HTMLInputElement>, value) => {
				mgr.saveFieldValue(field, value)
				mgr.clearFieldError(field.fieldId)
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.textField}
			errorMessage={mgr.getErrorMessage(field.fieldId)}
		/>
	)
})

function useInitialFieldValue(field: ServiceCustomField, mgr: FormFieldManager, editMode: boolean) {
	return useMemo(() => {
		let fieldValue = undefined

		if (editMode) {
			if (mgr.isFieldValueRecorded(field)) {
				fieldValue = mgr.getAnsweredFieldValue(field)
				mgr.saveFieldValue(field, fieldValue)
			}
		}
		return fieldValue
	}, [field, mgr, editMode])
}
