/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ServiceAnswerIdInput,
	VoidResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection } from '~db'
import { Interactor } from '~types'

export class DeleteServiceAnswerInteractor
	implements Interactor<ServiceAnswerIdInput, VoidResponse>
{
	#localization: Localization
	#serviceAnswers: ServiceAnswerCollection

	public constructor(localization: Localization, serviceAnswers: ServiceAnswerCollection) {
		this.#localization = localization
		this.#serviceAnswers = serviceAnswers
	}

	public async execute(serviceAnswer: ServiceAnswerIdInput): Promise<VoidResponse> {
		if (!serviceAnswer.answerId) {
			return {
				message: this.#localization.t('mutation.deleteServiceAnswer.answerIdRequired'),
				status: StatusType.Failed
			}
		}

		try {
			await this.#serviceAnswers.deleteItem({
				id: serviceAnswer.answerId
			})
		} catch (err) {
			throw err
		}

		return {
			message: this.#localization.t('mutation.deleteServiceAnswer.success'),
			status: StatusType.Success
		}
	}
}
