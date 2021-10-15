/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceAnswer,
	ServiceAnswerField,
	ServiceField,
	ServiceFieldRequirement
} from '@cbosuite/schema/dist/client-types'

export function getAnswerForField(answers: ServiceAnswer, field: ServiceField): ServiceAnswerField {
	return answers?.fields.find((f) => f.fieldId === field.id)
}

export function isRequired(field: ServiceField): boolean {
	return field.requirement === ServiceFieldRequirement.Required
}
