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

export const SingleTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	record: ServiceAnswers
	onChange: (submitEnabled: boolean) => void
}> = function SingleTextField({ editMode, mgr, field, record, onChange }) {
	let fieldValue = undefined
	const { t } = useTranslation('services')

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
			required={field.fieldRequirements === 'required'}
			defaultValue={fieldValue}
			onBlur={(e: FocusEvent<HTMLInputElement>) => {
				mgr.clearFieldError(field.fieldId)

				if (field.fieldType === 'number' && isNaN(e.target.value as any)) {
					mgr.saveFieldValue(field, '')
					mgr.addFieldError(field.fieldId, t('formGenerator.validation.numeric'))
				}
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
