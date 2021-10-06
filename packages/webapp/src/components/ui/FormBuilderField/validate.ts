/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IFormBuilderFieldProps } from '.'
import { FieldType } from './types'

export function validate(field: IFormBuilderFieldProps): [boolean, string] {
	let isValid = false
	let message = ''
	if (
		field?.label &&
		field?.fieldType &&
		field?.fieldRequirement &&
		field?.fieldType !== FieldType.SingleChoice &&
		field?.fieldType !== FieldType.MultiChoice &&
		field?.fieldType !== FieldType.MultilineText
	) {
		isValid = true
	} else {
		switch (field?.fieldType) {
			case FieldType.SingleChoice:
				isValid =
					field?.label &&
					field?.fieldRequirement &&
					field?.value?.length > 1 &&
					field?.value.every((v) => v.label !== '')
				message = 'formBuilder.validations.singleChoice'
				break
			case FieldType.MultiChoice:
				isValid =
					field?.label &&
					field?.fieldRequirement &&
					field?.value?.length >= 1 &&
					field?.value.every((v) => v.label !== '')
				message = 'formBuilder.validations.multiChoice'
				break
			default:
				message = 'formBuilder.validations.allRequired'
				break
		}
	}
	return [isValid, message]
}
