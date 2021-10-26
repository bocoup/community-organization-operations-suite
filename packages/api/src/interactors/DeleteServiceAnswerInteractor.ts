/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationDeleteServiceAnswerArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceAnswerCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class DeleteServiceAnswerInteractor
	implements Interactor<MutationDeleteServiceAnswerArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute(
		serviceAnswer: MutationDeleteServiceAnswerArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		if (!serviceAnswer.answerId) {
			return new FailedResponse(
				this.localization.t('mutation.deleteServiceAnswer.answerIdRequired', locale)
			)
		}

		try {
			await this.serviceAnswers.deleteItem({
				id: serviceAnswer.answerId
			})
		} catch (err) {
			throw err
		}

		return new SuccessVoidResponse(
			this.localization.t('mutation.deleteServiceAnswer.success', locale)
		)
	}
}
