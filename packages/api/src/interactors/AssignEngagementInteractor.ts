/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	EngagementResponse,
	EngagementUserInput,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization, Notifications } from '~components'
import { DbAction, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createGQLEngagement, createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { createLogger } from '~utils'
const logger = createLogger('interactors:assign-engagement', true)

export class AssignEngagementInteractor
	implements Interactor<EngagementUserInput, EngagementResponse>
{
	#localization: Localization
	#pubsub: PubSub
	#engagements: EngagementCollection
	#users: UserCollection
	#notifier: Notifications

	public constructor(
		localization: Localization,
		pubsub: PubSub,
		engagements: EngagementCollection,
		users: UserCollection,
		notifier: Notifications
	) {
		this.#localization = localization
		this.#pubsub = pubsub
		this.#engagements = engagements
		this.#users = users
		this.#notifier = notifier
	}

	public async execute(
		body: EngagementUserInput,
		{ identity }: RequestContext
	): Promise<EngagementResponse> {
		const { engId: id, userId } = body
		const [engagement, user] = await Promise.all([
			this.#engagements.itemById(id),
			this.#users.itemById(userId)
		])
		if (!user.item) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.assignEngagement.userNotFound'),
				status: StatusType.Failed
			}
		}
		if (!engagement.item) {
			return {
				engagement: null,
				message: this.#localization.t('mutation.assignEngagement.requestNotFound'),
				status: StatusType.Failed
			}
		}

		// Set assignee
		await this.#engagements.updateItem({ id }, { $set: { user_id: userId } })

		// Create action for assignment or claimed
		let dbAction: DbAction | undefined = undefined
		const currentUserId = identity?.id

		if (currentUserId && userId !== currentUserId) {
			// Create assignment action
			dbAction = createDBAction({
				comment: this.#localization.t('mutation.assignEngagement.actions.assignedRequest', {
					username: user.item.user_name
				}),
				orgId: engagement.item.org_id,
				userId: user.item.id,
				taggedUserId: user.item.id
			})

			// Send the user a push notification
			if (user.item.fcm_token) {
				logger('attempting to send message to ', user.item.fcm_token)
				this.#notifier.sendMessage({
					token: user.item.fcm_token,
					notification: {
						title: 'A client needs your help!',
						body: 'Go to the dashboard to view this request'
					}
				})
			}
		}

		if (currentUserId && userId === currentUserId) {
			// Create claimed action
			dbAction = createDBAction({
				comment: this.#localization.t('mutation.assignEngagement.actions.claimedRequest'),
				orgId: engagement.item.org_id,
				userId: currentUserId,
				taggedUserId: currentUserId
			})
		}

		if (dbAction) {
			await this.#engagements.updateItem({ id }, { $push: { actions: dbAction } })
			engagement.item.actions = [...engagement.item.actions, dbAction].sort(sortByDate)
		}

		const updatedEngagement = {
			...createGQLEngagement(engagement.item),
			user: createGQLUser(user.item)
		}

		// Publish changes to websocketk connection
		await this.#pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${engagement.item.org_id}`, {
			action: 'UPDATE',
			message: this.#localization.t('mutation.assignEngagement.success'),
			engagement: updatedEngagement,
			status: StatusType.Success
		})

		// Return updated engagement
		return {
			engagement: updatedEngagement,
			message: this.#localization.t('mutation.assignEngagement.success'),
			status: StatusType.Success
		}
	}
}
