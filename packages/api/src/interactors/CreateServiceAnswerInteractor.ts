/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection, ServiceCollection } from '~db'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { FailedResponse, SuccessServiceAnswerResponse } from '~utils/response'

export class CreateServiceAnswerInteractor
	implements Interactor<MutationCreateServiceAnswerArgs, ServiceAnswerResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute({
		serviceAnswer: answer
	}: MutationCreateServiceAnswerArgs): Promise<ServiceAnswerResponse> {
		if (!answer.serviceId) {
			return new FailedResponse(
				this.localization.t('mutation.createServiceAnswers.serviceIdRequired')
			)
		}
		const service = await this.services.itemById(answer.serviceId)
		if (!service.item) {
			return new FailedResponse(
				this.localization.t('mutation.createServiceAnswers.serviceNotFound')
			)
		}

		validateAnswer(service.item, answer)

		const dbServiceAnswer = createDBServiceAnswer(answer)
		this.serviceAnswers.insertItem(dbServiceAnswer)

		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.createServiceAnswers.success'),
			createGQLServiceAnswer(dbServiceAnswer)
		)
	}
}
