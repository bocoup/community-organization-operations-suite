/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { ServiceAnswerCollection, ServiceCollection } from '~db'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor, RequestContext } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { SuccessServiceAnswerResponse } from '~utils/response'

export class CreateServiceAnswerInteractor
	implements Interactor<MutationCreateServiceAnswerArgs, ServiceAnswerResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute(
		{ serviceAnswer: answer }: MutationCreateServiceAnswerArgs,
		{ locale }: RequestContext
	): Promise<ServiceAnswerResponse> {
		if (!answer.serviceId) {
			throw new UserInputError(
				this.localization.t('mutation.createServiceAnswers.serviceIdRequired', locale)
			)
		}
		const service = await this.services.itemById(answer.serviceId)
		if (!service.item) {
			throw new UserInputError(
				this.localization.t('mutation.createServiceAnswers.serviceNotFound', locale)
			)
		}

		validateAnswer(service.item, answer)

		const dbServiceAnswer = createDBServiceAnswer(answer)
		this.serviceAnswers.insertItem(dbServiceAnswer)

		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.createServiceAnswers.success', locale),
			createGQLServiceAnswer(dbServiceAnswer)
		)
	}
}
