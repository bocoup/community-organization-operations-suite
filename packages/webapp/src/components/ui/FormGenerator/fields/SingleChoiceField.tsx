/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceField,
	ServiceFieldRequirement,
	ServiceFieldValue
} from '@cbosuite/schema/dist/client-types'
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import { FC, memo, useMemo } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const SingleChoiceField: FC<{
	editMode: boolean
	previewMode: boolean
	mgr: FormFieldManager
	field: ServiceField
	onChange: (submitEnabled: boolean) => void
}> = memo(function SingleChoiceField({ editMode, previewMode, mgr, field, onChange }) {
	const options = useOptions(field, previewMode)
	const defaultOption = useDefaultOption(options, mgr, field, editMode)

	return (
		<ChoiceGroup
			label={field.name}
			required={field.requirement === ServiceFieldRequirement.Required}
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

function useOptions(field: ServiceField, previewMode: boolean): IChoiceGroupOption[] {
	return useMemo(
		() =>
			field?.inputs.map((value: ServiceFieldValue, index) => {
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

function useDefaultOption(
	options: IChoiceGroupOption[],
	mgr: FormFieldManager,
	field: ServiceField,
	editMode: boolean
) {
	return useMemo(() => {
		// prevent overwriting choice if the field is already filled
		let defaultOption = options[0]
		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const currChoiceValue = mgr.getAnsweredFieldValue(field)
			if (currChoiceValue) {
				defaultOption = options.find((o) => o.key === currChoiceValue)
			}
			mgr.saveFieldValue(field, defaultOption.key)
		} else if (mgr.isFieldValueRecorded(field)) {
			defaultOption = options.find((o) => o.text === mgr.getRecordedFieldValue(field))
		} else {
			mgr.saveFieldValue(field, defaultOption.key)
		}
		return defaultOption
	}, [editMode, field, mgr, options])
}
