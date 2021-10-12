/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField, ServiceCustomFieldValue } from '@cbosuite/schema/dist/client-types'
import { ChoiceGroup } from '@fluentui/react'
import React, { FC, memo, useMemo } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const SingleChoiceField: FC<{
	editMode: boolean
	previewMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function SingleChoiceField({ editMode, previewMode, mgr, field, onChange }) {
	const options = useOptions(field, previewMode)

	// prevent overwriting choice if the field is already filled
	let defaultOption = options[0]
	if (!mgr.values[field.fieldType]) {
		if (editMode) {
			const currChoiceValue = mgr.getAnsweredFieldValue(field)
			if (currChoiceValue) {
				defaultOption = options.find((o) => o.key === currChoiceValue)
			}
		}
		mgr.saveFieldValue(field, defaultOption.key)
	} else {
		if (mgr.isFieldValueRecorded(field)) {
			defaultOption = options.find((o) => o.text === mgr.getRecordedFieldValue(field))
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
})

function useOptions(field: ServiceCustomField, previewMode: boolean) {
	return useMemo(
		() =>
			field?.fieldValue.map((value: ServiceCustomFieldValue, index) => {
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
			}),
		[field, previewMode]
	)
}
