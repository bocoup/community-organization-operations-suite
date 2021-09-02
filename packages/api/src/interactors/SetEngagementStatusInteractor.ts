/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EngagementResponse,
	EngagementStatus,
	EngagementStatusInput,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization } from '~components'
import { EngagementCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'

export class SetEngagementStatusInteractor
	implements Interactor<EngagementStatusInput, EngagementResponse>
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

	public async execute(body: EngagementStatusInput, { identity }: RequestContext) {
		const { engId: id, status } = body
		const engagement = await this.#engagements.itemById(id)
		if (!engagement.item) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.setEngagementStatus.requestNotFound'),
				status: StatusType.Failed
			}
		}

		// Set status
		await this.#engagements.updateItem({ id }, { $set: { status } })
		engagement.item.status = status

		if (status === EngagementStatus.Closed) {
			// Create action
			const currentUserId = identity?.id
			if (currentUserId) {
				const nextAction = createDBAction({
					comment: this.#localization.t('mutation.setEngagementStatus.actions.markComplete'),
					orgId: engagement.item.org_id,
					userId: currentUserId,
					taggedUserId: currentUserId
				})

				await this.#engagements.updateItem({ id }, { $push: { actions: nextAction } })
				engagement.item.actions = [...engagement.item.actions, nextAction].sort(sortByDate)
			}

			// Publish changes to websocketk connection
			await this.#pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
				action: 'CLOSED',
				message: this.#localization.t('mutation.setEngagementStatus.success'),
				engagement: createGQLEngagement(engagement.item),
				status: StatusType.Success
			})
		}

		return {
			engagement: createGQLEngagement(engagement.item),
			message: this.#localization.t('mutation.setEngagementStatus.success'),
			status: StatusType.Success
		}
	}
}
