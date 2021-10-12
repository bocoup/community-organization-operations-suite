/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceAnswers,
	ServiceCustomField,
	ServiceCustomFieldValue
} from '@cbosuite/schema/dist/client-types'
import { Checkbox, Label } from '@fluentui/react'
import React, { FC } from 'react'
import { FormFieldManager } from './FormFieldManager'
import { fieldStyles } from './styles'

export const MultiChoiceField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	record: ServiceAnswers
	onChange: (submitEnabled: boolean) => void
}> = function MultiChoiceField({ editMode, mgr, field, record, onChange }) {
	if (editMode) {
		if (!mgr.values[field.fieldType]) {
			const currValues = record?.fieldAnswers[field.fieldType]?.find(
				(f) => f.fieldId === field.fieldId
			).values

			mgr.values[field.fieldType] = [{ fieldId: field.fieldId, values: currValues }]
		} else {
			const currValues = record?.fieldAnswers[field.fieldType]?.find(
				(f) => f.fieldId === field.fieldId
			).values

			mgr.values[field.fieldType] = [
				...mgr.values[field.fieldType],
				{ fieldId: field.fieldId, values: currValues }
			]
		}
	}

	const isChecked = (id: string): boolean => {
		if (mgr.values[field.fieldType]) {
			return mgr.values[field.fieldType]
				?.find((f) => f.fieldId === field.fieldId)
				?.values?.includes(id)
		}
		return false
	}

	return (
		<>
			<Label className='mb-3' required={field.fieldRequirements === 'required'} styles={labelStyle}>
				{field.fieldName}
			</Label>
			{field?.fieldValue.map((value: ServiceCustomFieldValue) => {
				return (
					<Checkbox
						className='mb-3'
						key={value.id}
						label={value.label}
						defaultChecked={isChecked(value.id)}
						onChange={(e, checked) => {
							mgr.saveFieldMultiValue(field, value, checked)
							onChange(mgr.isSubmitEnabled())
						}}
						styles={fieldStyles.checkbox}
					/>
				)
			})}
		</>
	)
}

const labelStyle = {
	root: {
		':after': {
			color: 'var(--bs-danger)'
		}
	}
}
