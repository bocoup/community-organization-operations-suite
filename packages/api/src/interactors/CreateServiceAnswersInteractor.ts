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
import { ServiceAnswerCollection } from '~db'
import { createDBServiceAnswer } from '~dto'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor } from '~types'

export class CreateServiceAnswersInteractor
	implements Interactor<ServiceAnswerInput, ServiceAnswerResponse>
{
	#localization: Localization
	#serviceAnswers: ServiceAnswerCollection

	public constructor(localization: Localization, serviceAnswers: ServiceAnswerCollection) {
		this.#localization = localization
		this.#serviceAnswers = serviceAnswers
	}

	public async execute(answer: ServiceAnswerInput): Promise<ServiceAnswerResponse> {
		if (!answer.serviceId) {
			return {
				serviceAnswer: null,
				message: this.#localization.t('mutation.createServiceAnswers.serviceIdRequired'),
				status: StatusType.Failed
			}
		}

		const dbServiceAnswer = createDBServiceAnswer(answer)
		this.#serviceAnswers.insertItem(dbServiceAnswer)

		return {
			serviceAnswer: createGQLServiceAnswer(dbServiceAnswer),
			message: this.#localization.t('mutation.createServiceAnswers.success'),
			status: StatusType.Success
		}
	}
}
