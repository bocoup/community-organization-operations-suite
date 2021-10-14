/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ServiceAnswerInput,
	ServiceAnswerResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { createDbServiceAnswerField } from '~dto/createDbServiceAnswerField'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

export class UpdateServiceAnswerInteractor
	implements Interactor<ServiceAnswerInput, ServiceAnswerResponse>
{
	#localization: Localization
	#serviceAnswers: ServiceAnswerCollection

	public constructor(localization: Localization, serviceAnswers: ServiceAnswerCollection) {
		this.#localization = localization
		this.#serviceAnswers = serviceAnswers
	}

	public async execute(answer: ServiceAnswerInput): Promise<ServiceAnswerResponse> {
		if (!answer.id) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.updateServiceAnswers.answerIdRequired'),
				status: StatusType.Failed
			}
		}

		//update the service answer
		try {
			await this.#serviceAnswers.updateItem(
				{ id: answer.id },
				{
					$set: {
						contacts: answer.contacts || [],
						fields: answer.fields?.map(createDbServiceAnswerField) ?? empty
					}
				}
			)
		} catch (err) {
			throw err
		}

		const dbAnswer = (await this.#serviceAnswers.itemById(answer.id)).item!
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
