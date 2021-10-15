/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement, ServiceFieldType } from '@cbosuite/schema/dist/provider-types'
import { Db, MongoClient } from 'mongodb'
import {
	DbService,
	DbServiceAnswer,
	DbServiceInputField,
	DbServiceField,
	DbServiceAnswerField
} from '../src/db/types'

module.exports = {
	async up(db: Db, client: MongoClient) {
		const services = db.collection<OldDbService>('services')
		const serviceAnswers = db.collection('service_answers')

		await services.find().forEach(async (service: OldDbService) => {
			const answers: OldDbAnswer[] = (service.answers as unknown as OldDbAnswer[]) || []
			const newAnswers = answers.map((a) => createAnswerRecord(a, service.id))
			if (newAnswers.length > 0) {
				await serviceAnswers.insertMany(newAnswers)
			}

			await services.updateOne(
				{ id: service.id },
				{
					$set: {
						fields: service.customFields ? transformServiceFields(service.customFields) : [],
						status: service.serviceStatus
					},
					$unset: {
						customFields: 1,
						serviceStatus: 1,
						answers: 1
					}
				}
			)
		})
	},

	async down(db: Db, client: MongoClient) {
		const services = db.collection('services')
		const serviceAnswers = db.collection('service_answers')

		await services.find().forEach(async (service: DbService) => {
			const answers = (await serviceAnswers.find({ service_id: service.id }).toArray()) || []
			await serviceAnswers.deleteMany({ service_id: service.id })
			await services.updateOne(
				{ id: service.id },
				{
					$set: {
						serviceStatus: service.status,
						customFields: service.fields ? transformServiceFieldsBack(service.fields) : [],
						answers: answers.map((a) => createOldAnswerRecord(a, service))
					},
					$unset: {
						status: 1,
						fields: 1
					}
				}
			)
		})

		await serviceAnswers.drop()
	}
}

interface OldDbService {
	id: string
	org_id: string
	name: string
	description?: string
	tags?: string[]
	customFields?: OldServiceField[]
	serviceStatus: ServiceStatus
	contactFormEnabled: boolean
	answers?: DbServiceAnswer[]
}

interface OldServiceField {
	fieldId: string
	fieldName: string
	fieldType: string
	fieldRequirements: 'optional' | 'required' | null
	fieldValue?: DbServiceInputField[]
}

interface OldDbAnswerField {
	fieldId: string
	values: string | string[]
}
interface OldDbAnswer {
	id: string
	contacts: string[]
	fieldAnswers: Partial<{
		singleText: Array<OldDbAnswerField>
		multilineText: Array<OldDbAnswerField>
		date: Array<OldDbAnswerField>
		number: Array<OldDbAnswerField>
		singleChoice: Array<OldDbAnswerField>
		multiChoice: Array<OldDbAnswerField>
		[key: string]: Array<OldDbAnswerField>
	}>
}

function transformServiceFields(customFields: OldServiceField[]): DbServiceField[] {
	return customFields.map((f) => {
		const result: DbServiceField = {
			id: f.fieldId,
			name: f.fieldName,
			type: oldTypeToType(f.fieldType),
			requirement: oldRequirementToRequirement(f.fieldRequirements),
			inputs: f.fieldValue
		}
		return result
	})
}

function transformServiceFieldsBack(customFields: DbServiceField[]): OldServiceField[] {
	return customFields.map((f) => {
		return {
			fieldId: f.id,
			fieldName: f.name,
			fieldType: typeToOldType(f.type),
			fieldRequirements: requirementToOldRequirement(f.requirement),
			fieldValue: f.inputs
		}
	})
}

function createAnswerRecord(answer: OldDbAnswer, serviceId: string): DbServiceAnswer {
	const fields: Array<DbServiceAnswerField> = []
	if (answer.fieldAnswers) {
		Object.keys(answer.fieldAnswers).forEach((key) => {
			const typeFields: OldDbAnswerField[] = (answer.fieldAnswers as any)[key] as OldDbAnswerField[]
			typeFields.forEach((typeField) => {
				fields.push({
					field_id: typeField.fieldId,
					value: typeField.values
				})
			})
		})
	}
	return {
		id: answer.id,
		service_id: serviceId,
		contacts: answer.contacts,
		fields
	}
}

function createOldAnswerRecord(answer: DbServiceAnswer, service: DbService): OldDbAnswer {
	const fieldAnswers: OldDbAnswer['fieldAnswers'] = {}

	answer.fields.forEach((f) => {
		const newField: OldDbAnswerField = {
			fieldId: f.field_id,
			values: f.value
		}
		const type = typeToOldType(service.fields?.find((sf) => f.field_id === sf.id)?.type)
		if (!fieldAnswers[type]) {
			fieldAnswers[type] = []
		}
		fieldAnswers[type]!.push(newField)
	})

	return {
		id: answer.id,
		contacts: answer.contacts,
		fieldAnswers
	}
}

function typeToOldType(type: ServiceFieldType | undefined): string {
	switch (type) {
		case ServiceFieldType.SingleText:
			return 'singleText'
		case ServiceFieldType.MultilineText:
			return 'multilineText'
		case ServiceFieldType.Date:
			return 'date'
		case ServiceFieldType.Number:
			return 'number'
		case ServiceFieldType.SingleChoice:
			return 'singleChoice'
		case ServiceFieldType.MultiChoice:
			return 'multiChoice'
		case ServiceFieldType.MultiText:
			return 'multiText'
		default:
			return 'singleText'
	}
}
function oldTypeToType(ot: string): ServiceFieldType {
	switch (ot) {
		case 'singleText':
			return ServiceFieldType.SingleText
		case 'multilineText':
			return ServiceFieldType.MultilineText
		case 'date':
			return ServiceFieldType.Date
		case 'number':
			return ServiceFieldType.Number
		case 'singleChoice':
			return ServiceFieldType.SingleChoice
		case 'multiChoice':
			return ServiceFieldType.MultiChoice
		case 'multiText':
			return ServiceFieldType.MultiText
		default:
			return ServiceFieldType.SingleText
	}
}

function oldRequirementToRequirement(
	or: OldServiceField['fieldRequirements']
): ServiceFieldRequirement {
	switch (or) {
		case 'required':
			return ServiceFieldRequirement.Required
		case 'optional':
			return ServiceFieldRequirement.Optional
		default:
			return ServiceFieldRequirement.Optional
	}
}

function requirementToOldRequirement(
	r: ServiceFieldRequirement
): OldServiceField['fieldRequirements'] {
	switch (r) {
		case ServiceFieldRequirement.Required:
			return 'required'
		case ServiceFieldRequirement.Optional:
			return 'optional'
	}
}
