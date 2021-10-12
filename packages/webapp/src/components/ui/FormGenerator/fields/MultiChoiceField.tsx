/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField, ServiceCustomFieldValue } from '@cbosuite/schema/dist/client-types'
import { Checkbox, Label } from '@fluentui/react'
import React, { FC, memo } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const MultiChoiceField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function MultiChoiceField({ editMode, mgr, field, onChange }) {
	if (editMode) {
		const currValues = mgr.getAnsweredFieldValue(field)
		mgr.saveFieldValue(field, currValues)
	}

	const isChecked = (id: string): boolean => {
		const v = mgr.getRecordedFieldValue(field)
		return v?.includes(id)
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
})

const labelStyle = {
	root: {
		':after': {
			color: 'var(--bs-danger)'
		}
	}
}
