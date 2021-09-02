/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	EngagementActionInput,
	EngagementResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization } from '~components'
import { DbAction, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createDBMention, createGQLEngagement, createGQLMention } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'

export class AddEngagementInteractor
	implements Interactor<EngagementActionInput, EngagementResponse>
{
	#localization: Localization
	#engagements: EngagementCollection
	#users: UserCollection
	#pubsub: PubSub

	public constructor(
		localization: Localization,
		engagements: EngagementCollection,
		users: UserCollection,
		pubsub: PubSub
	) {
		this.#localization = localization
		this.#engagements = engagements
		this.#users = users
		this.#pubsub = pubsub
	}

	public async execute(
		body: EngagementActionInput,
		{ identity }: RequestContext
	): Promise<EngagementResponse> {
		const { engId: id, action } = body
		if (!action.userId) {
			throw new Error(this.#localization.t('mutation.addEngagementAction.userIdRequired'))
		}

		//  Get engagement from db
		const engagement = await this.#engagements.itemById(id)

		// If not found
		if (!engagement.item) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.addEngagementAction.requestNotFound'),
				status: StatusType.Failed
			}
		}

		// Set actions
		const nextAction: DbAction = createDBAction(action)

		// Add a mention for the tagged user
		if (action.taggedUserId) {
			const taggedUser = await this.#users.itemById(action.taggedUserId)

			if (taggedUser.item) {
				const dbMention = createDBMention(
					engagement.item.id,
					identity?.id as string,
					nextAction.date,
					action.comment
				)
				this.#users.updateItem({ id: taggedUser.item.id }, { $push: { mentions: dbMention } })

				// Push to subscribed user
				await this.#pubsub.publish(`USER_MENTION_UPDATES_${taggedUser.item.id}`, {
					action: 'CREATED',
					message: this.#localization.t('mutation.addEngagementAction.success'),
					mention: createGQLMention(dbMention),
					status: StatusType.Success
				})
			}
		}

		await this.#engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		return {
			engagement: createGQLEngagement(engagement.item),
			message: this.#localization.t('mutation.addEngagementAction.success'),
			status: StatusType.Success
		}
	}
}
