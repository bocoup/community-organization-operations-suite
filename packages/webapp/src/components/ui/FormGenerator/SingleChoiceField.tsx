/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceAnswers,
	ServiceCustomField,
	ServiceCustomFieldValue
} from '@cbosuite/schema/dist/client-types'
import { ChoiceGroup } from '@fluentui/react'
import React, { FC } from 'react'
import { FormFieldManager } from './FormFieldManager'
import { fieldStyles } from './styles'

export const SingleChoiceField: FC<{
	editMode: boolean
	previewMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	record: ServiceAnswers
	onChange: (submitEnabled: boolean) => void
}> = function SingleChoiceField({ editMode, previewMode, mgr, field, record, onChange }) {
	const options = field?.fieldValue.map((value: ServiceCustomFieldValue, index) => {
		if (previewMode) {
			return {
				key: value.id || `${value.label}_preview__key__${index}`,
				text: value.label
			}
		} else {
			return {
				key: value.id,
				text: value.label
			}
		}
	})

	// prevent overwriting choice if the field is already filled
	let defaultOption = options[0]
	if (!mgr.values[field.fieldType]) {
		if (editMode) {
			const currChoiceValue = record?.fieldAnswers[field.fieldType]?.find(
				(f) => f.fieldId === field.fieldId
			).values
			if (currChoiceValue) {
				defaultOption = options.find((o) => o.key === currChoiceValue)
			}
		}

		mgr.saveFieldValue(field, defaultOption.key)
	} else {
		const index = mgr.values[field.fieldType].findIndex((f) => f.fieldId === field.fieldId)

		if (index !== -1) {
			defaultOption = options.find((o) => o.text === mgr.values[field.fieldType][index]?.values)
		} else {
			mgr.saveFieldValue(field, defaultOption.key)
		}
	}

	return (
		<ChoiceGroup
			label={field.fieldName}
			required={field.fieldRequirements === 'required'}
			options={options}
			defaultSelectedKey={defaultOption?.key}
			onFocus={() => {
				onChange(mgr.isSubmitEnabled())
			}}
			onChange={(e, option) => {
				mgr.saveFieldValue(field, option.key)
				onChange(mgr.isSubmitEnabled())
			}}
			styles={fieldStyles.choiceGroup}
		/>
	)
}
