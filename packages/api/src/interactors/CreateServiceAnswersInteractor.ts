/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ServiceAnswerInput,
	ServiceResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBServiceAnswer, createGQLService } from '~dto'
import { Interactor } from '~types'

export class CreateServiceAnswersInteractor
	implements Interactor<ServiceAnswerInput, ServiceResponse>
{
	#localization: Localization
	#services: ServiceCollection

	public constructor(localization: Localization, services: ServiceCollection) {
		this.#localization = localization
		this.#services = services
	}

	public async execute(serviceAnswer: ServiceAnswerInput): Promise<ServiceResponse> {
		if (!serviceAnswer.serviceId) {
			return {
				service: null,
				message: this.#localization.t('mutation.createServiceAnswers.serviceIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#services.itemById(serviceAnswer.serviceId)
		if (!result.item) {
			return {
				service: null,
				message: this.#localization.t('mutation.createServiceAnswers.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		const dbService = result.item
		const dbServiceAnswer = createDBServiceAnswer(serviceAnswer)

		try {
			await this.#services.updateItem(
				{ id: serviceAnswer.serviceId },
				{ $push: { answers: dbServiceAnswer } }
			)
		} catch (err) {
			throw err
		}

		dbService.answers?.push(dbServiceAnswer)

		return {
			service: createGQLService(dbService),
			message: this.#localization.t('mutation.createServiceAnswers.success'),
			status: StatusType.Success
		}
	}
}
