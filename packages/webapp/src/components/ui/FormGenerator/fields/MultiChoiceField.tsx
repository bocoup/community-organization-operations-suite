/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceCustomField, ServiceCustomFieldValue } from '@cbosuite/schema/dist/client-types'
import { Checkbox, Label } from '@fluentui/react'
import React, { FC, memo, useCallback, useEffect } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const MultiChoiceField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceCustomField
	onChange: (submitEnabled: boolean) => void
}> = memo(function MultiChoiceField({ editMode, mgr, field, onChange }) {
	useSynchronization(field, mgr, editMode)
	const isChecked = useCallback(
		(id: string): boolean => {
			const v = mgr.getAnsweredFieldValue(field)
			return v?.includes(id)
		},
		[field, mgr]
	)

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

function useSynchronization(field: ServiceCustomField, mgr: FormFieldManager, editMode: boolean) {
	useEffect(() => {
		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const currValues = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldValue(field, currValues)
		}
	}, [field, mgr, editMode])
}
