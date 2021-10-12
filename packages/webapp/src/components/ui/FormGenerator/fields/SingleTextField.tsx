/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import React, { FC, FocusEvent, memo, useCallback, useMemo } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const SingleTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function SingleTextField({ editMode, mgr, field, onChange }) {
	const initialValue = useInitialFieldValue(field, mgr, editMode)
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
			defaultValue={initialValue}
			onBlur={(e: FocusEvent<HTMLInputElement>) => handleChange(e.target.value)}
			onChange={(e, value) => handleChange(value)}
			styles={fieldStyles.textField}
			errorMessage={mgr.getErrorMessage(field.fieldId)}
		/>
	)
})

function useInitialFieldValue(field: ServiceCustomField, mgr: FormFieldManager, editMode: boolean) {
	return useMemo(() => {
		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const fieldValue = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldValue(field, fieldValue)
			return fieldValue || ''
		}
		return ''
	}, [field, mgr, editMode])
}
