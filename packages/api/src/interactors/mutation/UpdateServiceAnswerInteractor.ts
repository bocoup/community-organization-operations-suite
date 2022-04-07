/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationUpdateServiceAnswerArgs,
	ServiceAnswerResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { createDbServiceAnswerField } from '~dto/createDbServiceAnswerField'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor, RequestContext } from '~types'
import { validateAnswer } from '~utils/formValidation'
import { empty } from '~utils/noop'
import { SuccessServiceAnswerResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ServiceCollection } from '~db/ServiceCollection'
import { Telemetry } from '~components/Telemetry'
import { DbServiceAnswer } from '~db/types'
import { createAuditLog } from '~utils/audit'

@singleton()
export class UpdateServiceAnswerInteractor
	implements Interactor<unknown, MutationUpdateServiceAnswerArgs, ServiceAnswerResponse>
{
	public constructor(
		private localization: Localization,
		private services: ServiceCollection,
		private serviceAnswers: ServiceAnswerCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ serviceAnswer: input }: MutationUpdateServiceAnswerArgs,
		{ locale, identity }: RequestContext
	): Promise<ServiceAnswerResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		if (!input.id) {
			throw new UserInputError(
				this.localization.t('mutation.updateServiceAnswers.answerIdRequired', locale)
			)
		}

		const { item: answer } = await this.serviceAnswers.itemById(input.id)
		if (!answer) {
			throw new UserInputError(
				this.localization.t('mutation.updateServiceAnswers.answerNotFound', locale)
			)
		}
		const { item: service } = await this.services.itemById(answer.service_id)
		if (!service) {
			throw new UserInputError(
				this.localization.t('mutation.updateServiceAnswers.serviceNotFound', locale)
			)
		}

		validateAnswer(service, input)

		const [audit_log, update_date] = createAuditLog('update service answers', identity.id)
		const update: Partial<DbServiceAnswer> = {
			contacts: input.contacts || empty,
			fields: input.fields?.map(createDbServiceAnswerField) ?? empty,
			update_date
		}

		//update the service answer
		try {
			await this.serviceAnswers.updateItem({ id: input.id }, { $set: update, $push: [audit_log] })
		} catch (err) {
			throw err
		}

		this.telemetry.trackEvent('UpdateServiceAnswer')
		return new SuccessServiceAnswerResponse(
			this.localization.t('mutation.updateServiceAnswers.success', locale),
			createGQLServiceAnswer({ ...answer, ...update })
		)
	}
}
