/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceField,
	ServiceFieldRequirement,
	ServiceFieldValue
} from '@cbosuite/schema/dist/client-types'
import { Checkbox, Label } from '@fluentui/react'
import React, { FC, memo, useCallback, useEffect } from 'react'
import { FormFieldManager } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const MultiChoiceField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceField
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
			<Label
				className='mb-3'
				required={field.requirement === ServiceFieldRequirement.Required}
				styles={labelStyle}
			>
				{field.name}
			</Label>
			{field?.inputs.map((value: ServiceFieldValue) => {
				return (
					<Checkbox
						className='mb-3'
						key={value.id}
						label={value.label}
						defaultChecked={isChecked(value.id)}
						onChange={(e, checked) => {
							let values = mgr.getRecordedFieldValueList(field) ?? []
							if (checked) {
								if (values.indexOf(value.id) === -1) {
									values.push(value.id)
								}
							} else {
								if (values.indexOf(value.id) !== -1) {
									values = values.filter((v) => v !== value.id)
								}
							}
							mgr.saveFieldMultiValue(field, values)
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

function useSynchronization(field: ServiceField, mgr: FormFieldManager, editMode: boolean) {
	useEffect(() => {
		if (editMode && !mgr.isFieldValueRecorded(field)) {
			const currValues = mgr.getAnsweredFieldValue(field)
			mgr.saveFieldMultiValue(field, currValues)
		}
	}, [field, mgr, editMode])
}
