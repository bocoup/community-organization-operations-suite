/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
import { ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement, ServiceFieldType } from '@cbosuite/schema/dist/provider-types'
import { Collection, Db, MongoClient } from 'mongodb'
import {
	DbServiceAnswer,
	DbServiceFieldInput,
	DbServiceField,
	DbServiceAnswerField
} from '../src/db/types'
import { createAuditFields } from '../src/dto/createAuditFields'

module.exports = {
	async up(db: Db, client: MongoClient) {
		const services = db.collection<OldDbService>('services')
		const serviceAnswers = db.collection('service_answers')

		const serviceList = await (await services.find()).toArray()
		for (const service of serviceList) {
			await updateOldService(service, services, serviceAnswers)
		}

		console.log('finished!')
	},
	async down(db: Db, client: MongoClient) {}
}

async function updateOldService(
	service: OldDbService,
	services: Collection<OldDbService>,
	serviceAnswers: Collection<DbServiceAnswer>
) {
	try {
		if (service.answers) {
			console.log('handling service', service.name)
			const answers: OldDbAnswer[] = (service.answers as unknown as OldDbAnswer[]) || []
			const newAnswers = answers.map((a) => createAnswerRecord(a, service.id))
			console.log(`inserting ${newAnswers.length} answers for ${service.name}...`)
			if (newAnswers.length > 0) {
				await serviceAnswers.insertMany(newAnswers).catch((err) => {
					console.error(err)
					throw err
				})
			}
			const newFields = transformServiceFields(service.customFields ?? [])

			console.log(`updating service spec for ${service.name}...`)
			try {
				const result = await services.updateOne(
					{ id: service.id },
					{
						$set: {
							fields: service.customFields ? newFields : [],
							status: service.serviceStatus
						},
						$unset: {
							customFields: 1,
							serviceStatus: 1,
							answers: 1
						}
					}
				)
				console.log(`modified ${result.modifiedCount} service (expected 1)`)
			} catch (e) {
				console.error('error updating service', e)
				throw e
			}
		}
	} catch (e) {
		console.error(e)
		throw e
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
	fieldValue?: DbServiceFieldInput[]
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

function createAnswerRecord(answer: OldDbAnswer, serviceId: string): DbServiceAnswer {
	const fields: Array<DbServiceAnswerField> = []
	if (answer.fieldAnswers) {
		Object.keys(answer.fieldAnswers).forEach((key) => {
			const typeFields: OldDbAnswerField[] =
				(answer.fieldAnswers as any)[key] ?? ([] as OldDbAnswerField[])
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
		fields,
		...createAuditFields()
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
