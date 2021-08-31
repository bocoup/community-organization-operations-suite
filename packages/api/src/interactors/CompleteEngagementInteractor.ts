/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	EngagementIdInput,
	EngagementResponse,
	EngagementStatus,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization } from '~components'
import { DbUser, EngagementCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor } from '~types'
import { sortByDate } from '~utils'

export class CompleteEngagementInteractor
	implements Interactor<EngagementIdInput, EngagementResponse>
{
	#localization: Localization
	#engagements: EngagementCollection
	#pubsub: PubSub

	public constructor(
		localization: Localization,
		engagements: EngagementCollection,
		pubsub: PubSub
	) {
		this.#localization = localization
		this.#engagements = engagements
		this.#pubsub = pubsub
	}

	public async execute(body: EngagementIdInput, identity: DbUser): Promise<EngagementResponse> {
		const { engId: id } = body
		if (!identity) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.completeEngagement.unauthorized'),
				status: StatusType.Failed
			}
		}

		const engagement = await this.#engagements.itemById(id)
		if (!engagement.item) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.completeEngagement.requestNotFound'),
				status: StatusType.Failed
			}
		}

		// Set status
		await this.#engagements.updateItem({ id }, { $set: { status: EngagementStatus.Completed } })
		engagement.item.status = EngagementStatus.Completed

		// Publish changes to websocketk connection
		await this.#pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
			action: 'COMPLETED',
			message: this.#localization.t('mutation.completeEngagement.success'),
			engagement: createGQLEngagement(engagement.item),
			status: StatusType.Success
		})

		// Create action
		const currentUserId = identity.id
		const nextAction = createDBAction({
			comment: this.#localization.t('mutation.completeEngagement.actions.markComplete'),
			orgId: engagement.item.org_id,
			userId: currentUserId,
			taggedUserId: currentUserId
		})

		await this.#engagements.updateItem({ id }, { $push: { actions: nextAction } })
		engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)

		return {
			engagement: createGQLEngagement(engagement.item),
			message: this.#localization.t('mutation.completeEngagement.success'),
			status: StatusType.Success
		}
	}
}
