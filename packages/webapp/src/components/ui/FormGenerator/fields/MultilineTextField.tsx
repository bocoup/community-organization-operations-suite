/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceField, ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import React, { FC, FocusEvent, memo, useMemo } from 'react'
import { emptyStr } from '~utils/noop'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const MultiLineTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceField
	onChange: (submitEnabled: boolean) => void
}> = memo(function MultiLineTextField({ editMode, mgr, field, onChange }) {
	const fieldValue = useInitialFieldValue(field, mgr, editMode)
	return (
		<TextField
			label={field.name}
			defaultValue={fieldValue}
			autoAdjustHeight
			multiline
			required={field.requirement === ServiceFieldRequirement.Required}
			onBlur={(e: FocusEvent<HTMLInputElement>) => {
				mgr.saveFieldValue(field, e.target.value)
				mgr.clearFieldError(field.id)
				onChange(mgr.isSubmitEnabled())
			}}
			onChange={(e: FocusEvent<HTMLInputElement>, value) => {
				mgr.saveFieldValue(field, value)
				mgr.clearFieldError(field.id)
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.textField}
			errorMessage={mgr.getErrorMessage(field.id)}
		/>
	)
})

function useInitialFieldValue(field: ServiceField, mgr: FormFieldManager, editMode: boolean) {
	return useMemo(() => {
		let fieldValue

		if (editMode && !mgr.isFieldValueRecorded(field)) {
			fieldValue = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldValue(field, fieldValue)
		}
		return fieldValue ?? emptyStr
	}, [field, mgr, editMode])
}
