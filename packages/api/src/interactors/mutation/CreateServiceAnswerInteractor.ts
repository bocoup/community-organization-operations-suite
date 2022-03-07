/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import type { Interactor, RequestContext } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { SuccessServiceAnswerResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import type { Localization } from '~components/Localization'
import type { ServiceCollection } from '~db/ServiceCollection'
import type { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import type { Telemetry } from '~components/Telemetry'

@singleton()
export class CreateServiceAnswerInteractor
	implements Interactor<unknown, MutationCreateServiceAnswerArgs, ServiceAnswerResponse>
{
	public constructor(
		private localization: Localization,
		private services: ServiceCollection,
		private serviceAnswers: ServiceAnswerCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
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

		this.telemetry.trackEvent('CreateServiceAnswer')
		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.createServiceAnswers.success', locale),
			createGQLServiceAnswer(dbServiceAnswer)
		)
	}
}
