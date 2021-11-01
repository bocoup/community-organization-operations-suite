/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ServiceAnswerField,
	ServiceAnswerFieldInput,
	ServiceAnswerInput,
	ServiceFieldRequirement,
	ServiceFieldType
} from '@cbosuite/schema/dist/provider-types'
import { DbService, DbServiceField } from '~db/types'
import { empty } from './noop'

export function validateAnswer(service: DbService, answer: ServiceAnswerInput) {
	const serviceFieldMap: Record<string, DbServiceField> = {}
	const answerFieldMap: Record<string, ServiceAnswerField> = {}
	service.fields?.forEach((field) => (serviceFieldMap[field.id] = field))
	answer.fields.forEach((field) => (answerFieldMap[field.fieldId] = field))

	// Validate that all required fields have been submitted
	service.fields?.forEach((f) => {
		if (f.requirement === ServiceFieldRequirement.Required) {
			if (!answerFieldMap[f.id]) {
				throw new Error(`Missing required field ${f.id} of type ${f.type}`)
			}
			const value = isSingleInputField(f.type)
				? extractSingleValue(answerFieldMap[f.id], f)
				: extractMultiValue(answerFieldMap[f.id], f)
			if (value == null || (Array.isArray(value) && value.length === 0)) {
				throw new Error(`Missing required value for field ${f.id}`)
			}
		}
	})

	// Validated submitted fields
	answer.fields.forEach((f) => {
		const serviceField = serviceFieldMap[f.fieldId]
		// references a valid service field
		if (!serviceField) {
			throw new Error(`Invalid field id ${f.fieldId} for service ${service.id}`)
		}

		// Has correct data type
		switch (serviceField.type) {
			case ServiceFieldType.SingleText:
			case ServiceFieldType.MultilineText:
				extractSingleValue(f, serviceField)
				break
			case ServiceFieldType.Number:
				const number = extractSingleValue(f, serviceField)
				const parsed = parseInt(number)
				if (Number.isNaN(parsed) || `${parsed}` !== f.value) {
					throw new Error(
						`Invalid value "${f.value}" for field ${f.fieldId} of type ${serviceField.type} (unparseable number)`
					)
				}
				break
			case ServiceFieldType.Date:
				const dateStr = extractSingleValue(f, serviceField)
				if (dateStr != null) {
					const parsed = new Date(dateStr)
					if (parsed.toString() === 'Invalid Date') {
						throw new Error(
							`Invalid value "${f.value}" for field ${f.fieldId} of type ${serviceField.type} (unparseable date)`
						)
					}
				}
				break

			case ServiceFieldType.SingleChoice:
				const choice = extractSingleValue(f, serviceField)
				if (!serviceField.inputs?.some((f) => f.id === choice)) {
					throw new Error(
						`Invalid value "${f.value}" for field ${f.fieldId} of type ${serviceField.type} (choice not found)`
					)
				}
				break
			case ServiceFieldType.MultiChoice:
				const choices = extractMultiValue(f, serviceField)
				for (const choice of choices) {
					if (!serviceField.inputs?.some((f) => f.id === choice)) {
						throw new Error(
							`Invalid value "${f.value}" for field ${f.fieldId} of type ${serviceField.type} (choice not found)`
						)
					}
				}
				break
			default:
				throw new Error(`Invalid field type ${serviceField.type} for field ${f.fieldId}`)
		}
	})
}

function isSingleInputField(type: ServiceFieldType): boolean {
	switch (type) {
		case ServiceFieldType.SingleText:
		case ServiceFieldType.SingleChoice:
		case ServiceFieldType.MultilineText:
		case ServiceFieldType.Number:
		case ServiceFieldType.Date:
			return true
		case ServiceFieldType.MultiChoice:
			return false
		default:
			return true
	}
}

function extractSingleValue(field: ServiceAnswerFieldInput, serviceField: DbServiceField) {
	if (field.values != null) {
		throw new Error(
			`did not expect a values array for single field ${field.fieldId}, ${serviceField.name}`
		)
	}
	return field.value as string
}

function extractMultiValue(field: ServiceAnswerFieldInput, serviceField: DbServiceField): string[] {
	if (field.value != null) {
		throw new Error(
			`did not expect a single value for multi field ${field.fieldId},  ${serviceField.name}`
		)
	}
	return (field.values as string[]) ?? empty
}
