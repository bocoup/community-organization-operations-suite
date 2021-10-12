/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import React, { FC, FocusEvent, memo, useCallback } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const SingleTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function SingleTextField({ editMode, mgr, field, onChange }) {
	let fieldValue = undefined
	if (editMode) {
		const isRecorded = mgr.isFieldValueRecorded(field)
		if (!isRecorded) {
			fieldValue = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldValue(field, fieldValue)
		}
	}

	const handleChange = useCallback(
		(value: string) => {
			mgr.clearFieldError(field.fieldId)
			mgr.saveFieldValue(field, value)
			onChange(mgr.isSubmitEnabled())
		},
		[field, mgr, onChange]
	)

	return (
		<TextField
			label={field.fieldName}
			required={field.fieldRequirements === 'required'}
			defaultValue={fieldValue}
			onBlur={(e: FocusEvent<HTMLInputElement>) => handleChange(e.target.value)}
			onChange={(e, value) => handleChange(value)}
			styles={fieldStyles.textField}
			errorMessage={mgr.getErrorMessage(field.fieldId)}
		/>
	)
})
