/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ServiceAnswer,
	ServiceAnswerField,
	ServiceAnswerInput,
	ServiceField
} from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement, ServiceFieldType } from '@cbosuite/schema/dist/client-types'

/**
 * Get the submitted answer for a field
 *
 * @param answers The sumbitted service answer
 * @param field The filed to retrieve
 * @returns The field value that has been submitted
 */
export function getRecordedFieldValue(
	answers: ServiceAnswer,
	field: ServiceField
): ServiceAnswerField {
	return answers?.fields.find((f) => f.fieldId === field.id)
}

/**
 * Get the submitted answer for a field
 *
 * @param answers The sumbitted service answer
 * @param field The filed to retrieve
 * @returns The field value that has been submitted
 */
export function getPendingFieldValue(
	answers: ServiceAnswerInput,
	field: ServiceField
): ServiceAnswerField {
	return answers?.fields.find((f) => f.fieldId === field.id)
}

/**
 * Is the given field required
 *
 * @param field The given field
 * @returns Whether the given field is required
 */
export function isRequired(field: ServiceField): boolean {
	return field.requirement === ServiceFieldRequirement.Required
}

/**
 * Does the given field type require input options?
 *
 * @param fieldType The type of field this is
 * @returns Whether this field has multiple input options
 */
export function hasOptionFields(fieldType: ServiceFieldType) {
	return fieldType === ServiceFieldType.SingleChoice || fieldType === ServiceFieldType.MultiChoice
}
