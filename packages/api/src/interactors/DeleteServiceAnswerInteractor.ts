/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationDeleteServiceAnswerArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { Telemetry } from '~components/Telemetry'

@singleton()
export class DeleteServiceAnswerInteractor
	implements Interactor<MutationDeleteServiceAnswerArgs, VoidResponse>
{
	public constructor(
		private localization: Localization,
		private serviceAnswers: ServiceAnswerCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		serviceAnswer: MutationDeleteServiceAnswerArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		if (!serviceAnswer.answerId) {
			throw new UserInputError(
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

		this.telemetry.trackEvent('DeleteServiceAnswer')
		return new SuccessVoidResponse(
			this.localization.t('mutation.deleteServiceAnswer.success', locale)
		)
	}
}
