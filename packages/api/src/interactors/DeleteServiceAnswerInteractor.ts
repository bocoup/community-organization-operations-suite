/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ServiceAnswerIdInput,
	ServiceResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createGQLService } from '~dto'
import { Interactor } from '~types'

export class DeleteServiceAnswerInteractor
	implements Interactor<ServiceAnswerIdInput, ServiceResponse>
{
	#localization: Localization
	#services: ServiceCollection

	public constructor(localization: Localization, services: ServiceCollection) {
		this.#localization = localization
		this.#services = services
	}

	public async execute(serviceAnswer: ServiceAnswerIdInput): Promise<ServiceResponse> {
		if (!serviceAnswer.serviceId) {
			return {
				service: null,
				message: this.#localization.t('mutation.deleteServiceAnswer.serviceIdRequired'),
				status: StatusType.Failed
			}
		}

		if (!serviceAnswer.answerId) {
			return {
				service: null,
				message: this.#localization.t('mutation.deleteServiceAnswer.answerIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#services.itemById(serviceAnswer.serviceId)
		if (!result.item) {
			return {
				service: null,
				message: this.#localization.t('mutation.deleteServiceAnswer.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		const dbService = result.item

		try {
			await this.#services.updateItem(
				{ id: serviceAnswer.serviceId },
				{
					$pull: { answers: { id: serviceAnswer.answerId } }
				}
			)
		} catch (err) {
			throw err
		}

		const updateAnswerList = dbService.answers?.filter(
			(answer) => answer.id !== serviceAnswer.answerId
		)
		dbService.answers = updateAnswerList

		return {
			service: createGQLService(dbService),
			message: this.#localization.t('mutation.deleteServiceAnswer.success'),
			status: StatusType.Success
		}
	}
}
