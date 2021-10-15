/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Service,
	ServiceAnswer,
	ServiceAnswerField,
	ServiceAnswerInput,
	ServiceAnswerResponse,
	ServiceFieldRequirement,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbService, DbServiceField, ServiceAnswerCollection, ServiceCollection } from '~db'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'

export class CreateServiceAnswersInteractor
	implements Interactor<ServiceAnswerInput, ServiceAnswerResponse>
{
	#localization: Localization
	#services: ServiceCollection
	#serviceAnswers: ServiceAnswerCollection

	public constructor(
		localization: Localization,
		services: ServiceCollection,
		serviceAnswers: ServiceAnswerCollection
	) {
		this.#localization = localization
		this.#services = services
		this.#serviceAnswers = serviceAnswers
	}

	public async execute(answer: ServiceAnswerInput): Promise<ServiceAnswerResponse> {
		if (!answer.serviceId) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.createServiceAnswers.serviceIdRequired'),
				status: StatusType.Failed
			}
		}
		const service = await this.#services.itemById(answer.serviceId)
		if (!service.item) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.createServiceAnswers.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		validateAnswer(service.item, answer)

		const dbServiceAnswer = createDBServiceAnswer(answer)
		this.#serviceAnswers.insertItem(dbServiceAnswer)

		return {
			serviceAnswer: createGQLServiceAnswer(dbServiceAnswer),
			message: this.#localization.t('mutation.createServiceAnswers.success'),
			status: StatusType.Success
		}
	}
}

function validateAnswer(service: DbService, answer: ServiceAnswerInput) {
	const serviceFieldHash: Record<string, DbServiceField> = {}
	const answerFieldHash: Record<string, ServiceAnswerField> = {}
	service.fields?.forEach((field) => {
		serviceFieldHash[field.id] = field
	})
	answer.fields.forEach((field) => {
		answerFieldHash[field.fieldId] = field
	})

	service.fields?.forEach((f) => {
		// Validate that all required fields have been submitted
		if (f.requirement === ServiceFieldRequirement.Required) {
			if (!answerFieldHash[f.id]) {
				throw new Error(`Missing required field ${f.id} for service ${service.id}`)
			}
		}
	})
}
