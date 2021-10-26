/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationUpdateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { createDbServiceAnswerField } from '~dto/createDbServiceAnswerField'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor, RequestContext } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { empty } from '~utils/noop'
import { FailedResponse, SuccessServiceAnswerResponse } from '~utils/response'

export class UpdateServiceAnswerInteractor
	implements Interactor<MutationUpdateServiceAnswerArgs, ServiceAnswerResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute(
		{ serviceAnswer: input }: MutationUpdateServiceAnswerArgs,
		{ locale }: RequestContext
	): Promise<ServiceAnswerResponse> {
		if (!input.id) {
			return new FailedResponse(
				this.localization.t('mutation.updateServiceAnswers.answerIdRequired', locale)
			)
		}

		const answer = await this.serviceAnswers.itemById(input.id)
		if (!answer.item) {
			return new FailedResponse(
				this.localization.t('mutation.updateServiceAnswers.answerNotFound', locale)
			)
		}
		const service = await this.services.itemById(answer.item.service_id)
		if (!service.item) {
			return new FailedResponse(
				this.localization.t('mutation.updateServiceAnswers.serviceNotFound', locale)
			)
		}

		validateAnswer(service.item, input)

		//update the service answer
		try {
			await this.serviceAnswers.updateItem(
				{ id: input.id },
				{
					$set: {
						contacts: input.contacts || [],
						fields: input.fields?.map(createDbServiceAnswerField) ?? empty
					}
				}
			)
		} catch (err) {
			throw err
		}

		const dbAnswer = (await this.serviceAnswers.itemById(input.id)).item!
		if (!dbAnswer) {
			return new FailedResponse(
				this.localization.t('mutation.updateServiceAnswers.serviceAnswerNotFound', locale)
			)
		}
		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.updateServiceAnswers.success', locale),
			createGQLServiceAnswer(dbAnswer)
		)
	}
}
