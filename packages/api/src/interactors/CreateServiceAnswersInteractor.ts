/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswerInput, ServiceAnswerResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection, ServiceCollection } from '~db'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { FailedResponse, SuccessServiceAnswerResponse } from '~utils/response'

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
			return new FailedResponse(
				this.#localization.t('mutation.createServiceAnswers.serviceIdRequired')
			)
		}
		const service = await this.#services.itemById(answer.serviceId)
		if (!service.item) {
			return new FailedResponse(
				this.#localization.t('mutation.createServiceAnswers.serviceNotFound')
			)
		}

		validateAnswer(service.item, answer)

		const dbServiceAnswer = createDBServiceAnswer(answer)
		this.#serviceAnswers.insertItem(dbServiceAnswer)

		return new SuccessServiceAnswerResponse(
			this.#localization.t('mutation.createServiceAnswers.success'),
			createGQLServiceAnswer(dbServiceAnswer)
		)
	}
}
