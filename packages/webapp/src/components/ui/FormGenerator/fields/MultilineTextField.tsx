/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ServiceField } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import type { FC, FocusEvent } from 'react'
import React, { memo, useMemo } from 'react'
import { emptyStr } from '~utils/noop'
import type { FormFieldManager } from '../FormFieldManager'
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
				mgr.saveFieldSingleValue(field, e.target.value)
				mgr.clearFieldError(field.id)
				onChange(mgr.isSubmitEnabled())
			}}
			onChange={(e: FocusEvent<HTMLInputElement>, value) => {
				mgr.saveFieldSingleValue(field, value)
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
			mgr.saveFieldSingleValue(field, fieldValue)
		}
		return fieldValue ?? emptyStr
	}, [field, mgr, editMode])
}
