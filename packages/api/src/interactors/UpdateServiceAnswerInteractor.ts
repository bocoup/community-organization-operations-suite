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
import { DbServiceAnswer, ServiceCollection } from '~db'
import { createDBServiceAnswer, createGQLService } from '~dto'
import { Interactor } from '~types'

export class UpdateServiceAnswerInteractor
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
				message: this.#localization.t('mutation.updateServiceAnswers.serviceIdRequired'),
				status: StatusType.Failed
			}
		}

		if (!serviceAnswer.answerId) {
			return {
				service: null,
				message: this.#localization.t('mutation.updateServiceAnswers.answerIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#services.itemById(serviceAnswer.serviceId)
		if (!result.item) {
			return {
				service: null,
				message: this.#localization.t('mutation.updateServiceAnswers.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		const dbService = result.item
		const updatedDbServiceAnswer = createDBServiceAnswer(serviceAnswer)

		//update the service answer
		dbService.answers = (dbService.answers as DbServiceAnswer[]).map((answer) => {
			if (answer.id === serviceAnswer.answerId) {
				return updatedDbServiceAnswer
			}
			return answer
		})

		try {
			await this.#services.updateItem(
				{ id: dbService.id },
				{
					$set: { answers: dbService.answers }
				}
			)
		} catch (err) {
			throw err
		}

		return {
			service: createGQLService(dbService),
			message: this.#localization.t('mutation.updateServiceAnswers.success'),
			status: StatusType.Success
		}
	}
}
