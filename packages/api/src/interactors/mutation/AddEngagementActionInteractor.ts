/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationAddEngagementActionArgs,
	EngagementResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createDBAction, createDBMention, createGQLEngagement, createGQLMention } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { EngagementCollection } from '~db/EngagementCollection'
import { UserCollection } from '~db/UserCollection'
import { Publisher } from '~components/Publisher'
import { Telemetry } from '~components/Telemetry'
import { DbAction } from '~db/types'
import { createAuditLog } from '~utils/audit'

@singleton()
export class AddEngagementActionInteractor
	implements Interactor<unknown, MutationAddEngagementActionArgs, EngagementResponse>
{
	public constructor(
		private localization: Localization,
		private engagements: EngagementCollection,
		private users: UserCollection,
		private publisher: Publisher,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ engagementId: id, action }: MutationAddEngagementActionArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		if (!action.userId) {
			throw new UserInputError(
				this.localization.t('mutation.addEngagementAction.userIdRequired', locale)
			)
		}

		//  Get engagement from db
		const engagement = await this.engagements.itemById(id)

		// If not found
		if (!engagement.item) {
			throw new UserInputError(
				this.localization.t('mutation.addEngagementAction.requestNotFound', locale)
			)
		}

		// Set actions
		const nextAction: DbAction = createDBAction(action)

		// Add a mention for the tagged user
		if (action.taggedUserId) {
			const taggedUser = await this.users.itemById(action.taggedUserId)

			if (taggedUser.item) {
				const dbMention = createDBMention(
					engagement.item.id,
					identity.id,
					nextAction.date,
					action.comment
				)
				this.users.addMention(taggedUser.item, dbMention)
				await this.publisher.publishMention(taggedUser.item.id, createGQLMention(dbMention), locale)
			}
		}

		const [audit_log, update_date] = createAuditLog('add engagement', identity.id)
		await this.engagements.updateItem(
			{ id },
			{
				$push: {
					actions: nextAction,
					audit_log
				},
				$set: { update_date }
			}
		)
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		this.telemetry.trackEvent('AddEngagementAction')
		return new SuccessEngagementResponse(
			this.localization.t('mutation.addEngagementAction.success', locale),
			createGQLEngagement(engagement.item)
		)
	}
}
