/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCreateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor, RequestContext } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { SuccessServiceAnswerResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ServiceCollection } from '~db/ServiceCollection'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { Telemetry } from '~components/Telemetry'

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
		{ locale, identity }: RequestContext
	): Promise<ServiceAnswerResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
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

		const dbServiceAnswer = createDBServiceAnswer(answer, identity.id)
		this.serviceAnswers.insertItem(dbServiceAnswer)

		this.telemetry.trackEvent('CreateServiceAnswer')
		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.createServiceAnswers.success', locale),
			createGQLServiceAnswer(dbServiceAnswer)
		)
	}
}
