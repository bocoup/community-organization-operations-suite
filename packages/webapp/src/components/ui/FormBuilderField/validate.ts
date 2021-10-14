/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { IFormBuilderFieldProps } from '.'

export function validate(field: IFormBuilderFieldProps): [boolean, string] {
	let isValid = false
	let message = ''
	if (
		field?.label &&
		field?.type &&
		field?.requirement &&
		field?.type !== ServiceFieldType.SingleChoice &&
		field?.type !== ServiceFieldType.MultiChoice &&
		field?.type !== ServiceFieldType.MultilineText
	) {
		isValid = true
	} else {
		switch (field?.type) {
			case ServiceFieldType.SingleChoice:
				isValid =
					field?.label &&
					field?.requirement &&
					field?.inputs?.length > 1 &&
					field?.inputs.every((v) => v.label !== '')
				message = 'formBuilder.validations.singleChoice'
				break
			case ServiceFieldType.MultiChoice:
				isValid =
					field?.label &&
					field?.requirement &&
					field?.inputs?.length >= 1 &&
					field?.inputs.every((v) => v.label !== '')
				message = 'formBuilder.validations.multiChoice'
				break
			default:
				message = 'formBuilder.validations.allRequired'
				break
		}
	}
	return [isValid, message]
}
