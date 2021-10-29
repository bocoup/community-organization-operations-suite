/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationAddEngagementActionArgs,
	EngagementResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { Publisher } from '~components/Publisher'
import { DbAction, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createDBMention, createGQLEngagement, createGQLMention } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class AddEngagementActionInteractor
	implements Interactor<MutationAddEngagementActionArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly engagements: EngagementCollection,
		private readonly users: UserCollection,
		private readonly publisher: Publisher,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ engagementId: id, action }: MutationAddEngagementActionArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
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
					identity?.id as string,
					nextAction.date,
					action.comment
				)
				this.users.addMention(taggedUser.item, dbMention)
				await this.publisher.publishMention(taggedUser.item.id, createGQLMention(dbMention), locale)
			}
		}

		await this.engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		this.telemetry.trackEvent('AddEngagementAction')
		return new SuccessEngagementResponse(
			this.localization.t('mutation.addEngagementAction.success', locale),
			createGQLEngagement(engagement.item)
		)
	}
}
