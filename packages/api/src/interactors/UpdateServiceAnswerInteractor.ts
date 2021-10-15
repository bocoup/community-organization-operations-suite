/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ServiceAnswerInput,
	ServiceAnswerResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { validate } from 'graphql'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { createDbServiceAnswerField } from '~dto/createDbServiceAnswerField'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { empty } from '~utils/noop'

export class UpdateServiceAnswerInteractor
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

	public async execute(input: ServiceAnswerInput): Promise<ServiceAnswerResponse> {
		if (!input.id) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.updateServiceAnswers.answerIdRequired'),
				status: StatusType.Failed
			}
		}

		const answer = await this.#serviceAnswers.itemById(input.id)
		if (!answer.item) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.updateServiceAnswers.answerNotFound'),
				status: StatusType.Failed
			}
		}
		const service = await this.#services.itemById(answer.item.service_id)
		if (!service.item) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.updateServiceAnswers.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		validateAnswer(service.item, input)

		//update the service answer
		try {
			await this.#serviceAnswers.updateItem(
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

		const dbAnswer = (await this.#serviceAnswers.itemById(input.id)).item!
		if (!dbAnswer) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.updateServiceAnswers.serviceAnswerNotFound'),
				status: StatusType.Failed
			}
		}
		return {
			serviceAnswer: createGQLServiceAnswer(dbAnswer),
			message: this.#localization.t('mutation.updateServiceAnswers.success'),
			status: StatusType.Success
		}
	}
}
