/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { DateField } from './DateField'
import { FormFieldManager } from '../FormFieldManager'
import { MultiChoiceField } from './MultiChoiceField'
import { MultiLineTextField } from './MultilineTextField'
import { MultiTextField } from './MultiTextField'
import { SingleChoiceField } from './SingleChoiceField'
import { SingleTextField } from './SingleTextField'

export const Field: FC<{
	field: ServiceCustomField
	editMode: boolean
	previewMode: boolean
	mgr: FormFieldManager
	onChange: (enabled: boolean) => void
}> = memo(function Field(props) {
	const { field } = props
	if (field.fieldType === 'singleText' || field.fieldType === 'number') {
		return <SingleTextField {...props} />
	} else if (field.fieldType === 'multilineText') {
		return <MultiLineTextField {...props} />
	} else if (field.fieldType === 'date') {
		return <DateField {...props} />
	} else if (field.fieldType === 'singleChoice') {
		return <SingleChoiceField {...props} />
	} else if (field.fieldType === 'multiChoice') {
		return <MultiChoiceField {...props} />
	} else if (field.fieldType === 'multiText') {
		return <MultiTextField {...props} />
	} else {
		return null
	}
})
