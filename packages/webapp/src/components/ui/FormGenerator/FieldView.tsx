/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceAnswers, ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { DateField } from './DateField'
import { FormFieldManager } from './FormFieldManager'
import { MultiChoiceField } from './MultiChoiceField'
import { MultiLineTextField } from './MultilineTextField'
import { MultiTextField } from './MultiTextField'
import { SingleChoiceField } from './SingleChoiceField'
import { SingleTextField } from './SingleTextField'

export const FieldView: FC<{
	field: ServiceCustomField
	editMode?: boolean
	previewMode?: boolean
	mgr: FormFieldManager
	record?: ServiceAnswers
	onChange: (enabled: boolean) => void
}> = memo(function FieldView({ mgr, field, editMode, previewMode, record, onChange }) {
	if (field.fieldType === 'singleText' || field.fieldType === 'number') {
		return (
			<SingleTextField
				editMode={editMode}
				mgr={mgr}
				field={field}
				record={record}
				onChange={onChange}
			/>
		)
	} else if (field.fieldType === 'multilineText') {
		return (
			<MultiLineTextField
				editMode={editMode}
				mgr={mgr}
				field={field}
				record={record}
				onChange={onChange}
			/>
		)
	} else if (field.fieldType === 'date') {
		return (
			<DateField editMode={editMode} mgr={mgr} field={field} record={record} onChange={onChange} />
		)
	} else if (field.fieldType === 'singleChoice') {
		return (
			<SingleChoiceField
				editMode={editMode}
				previewMode={previewMode}
				mgr={mgr}
				field={field}
				record={record}
				onChange={onChange}
			/>
		)
	} else if (field.fieldType === 'multiChoice') {
		return (
			<MultiChoiceField
				editMode={editMode}
				mgr={mgr}
				field={field}
				record={record}
				onChange={onChange}
			/>
		)
	} else if (field.fieldType === 'multiText') {
		return (
			<MultiTextField
				editMode={editMode}
				mgr={mgr}
				field={field}
				record={record}
				onChange={onChange}
			/>
		)
	} else {
		return null
	}
})
