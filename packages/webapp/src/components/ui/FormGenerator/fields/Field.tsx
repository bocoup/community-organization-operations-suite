/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceField, ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { DateField } from './DateField'
import { FormFieldManager } from '../FormFieldManager'
import { MultiChoiceField } from './MultiChoiceField'
import { MultiLineTextField } from './MultilineTextField'
import { SingleChoiceField } from './SingleChoiceField'
import { SingleTextField } from './SingleTextField'
import { NumberField } from './NumberField'

export const Field: FC<{
	field: ServiceField
	editMode: boolean
	previewMode: boolean
	mgr: FormFieldManager
	onChange: (enabled: boolean) => void
}> = memo(function Field(props) {
	const { field } = props
	if (field.type === ServiceFieldType.SingleText) {
		return <SingleTextField {...props} />
	} else if (field.type === ServiceFieldType.Number) {
		return <NumberField {...props} />
	} else if (field.type === ServiceFieldType.MultilineText) {
		return <MultiLineTextField {...props} />
	} else if (field.type === ServiceFieldType.Date) {
		return <DateField {...props} />
	} else if (field.type === ServiceFieldType.SingleChoice) {
		return <SingleChoiceField {...props} />
	} else if (field.type === ServiceFieldType.MultiChoice) {
		return <MultiChoiceField {...props} />
	} else {
		return null
	}
})
