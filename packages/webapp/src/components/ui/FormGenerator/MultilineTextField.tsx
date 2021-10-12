/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswers, ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import React, { FC, FocusEvent } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { FormFieldManager } from './FormFieldManager'
import { fieldStyles } from './styles'

export const MultiLineTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	record: ServiceAnswers
	onChange: (submitEnabled: boolean) => void
}> = function MultiLineTextField({ editMode, mgr, field, record, onChange }) {
	const { t } = useTranslation('services')
	let fieldValue = undefined

	if (editMode) {
		const index = mgr.values[field.fieldType]?.findIndex((f) => f.fieldId === field.fieldId)
		if (index === undefined) {
			fieldValue = record?.fieldAnswers[field.fieldType]?.find(
				(f) => f.fieldId === field.fieldId
			)?.values
			mgr.saveFieldValue(field, fieldValue)
		}
	}

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
				if (field.fieldRequirements === 'required' && e.target.value === '') {
					mgr.addFieldError(field.fieldId, t('formGenerator.validation.required'))
				}
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.textField}
			errorMessage={mgr.getErrorMessage(field.fieldId)}
		/>
	)
}
