/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswerIdInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class DeleteServiceAnswerInteractor
	implements Interactor<ServiceAnswerIdInput, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute(serviceAnswer: ServiceAnswerIdInput): Promise<VoidResponse> {
		if (!serviceAnswer.answerId) {
			return new FailedResponse(
				this.localization.t('mutation.deleteServiceAnswer.answerIdRequired')
			)
		}

		try {
			await this.serviceAnswers.deleteItem({
				id: serviceAnswer.answerId
			})
		} catch (err) {
			throw err
		}

		return new SuccessVoidResponse(this.localization.t('mutation.deleteServiceAnswer.success'))
	}
}
