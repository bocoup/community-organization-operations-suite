/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	EngagementInput,
	EngagementResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { PubSub } from 'graphql-subscriptions'
import { Localization, Notifications } from '~components'
import { DbAction, EngagementCollection, UserCollection } from '~db'
import {
	createDBAction,
	createDBEngagement,
	createDBMention,
	createGQLEngagement,
	createGQLMention
} from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'

export class CreateEngagementInteractor implements Interactor<EngagementInput, EngagementResponse> {
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
		body: EngagementInput,
		{ identity }: RequestContext
	): Promise<EngagementResponse> {
		// Create a dbabase object from input values
		const nextEngagement = createDBEngagement({ ...body })

		// Insert engagement into enagements collection
		await this.#engagements.insertItem(nextEngagement)

		// User who created the request
		const user = identity?.id
		if (!user) throw Error(this.#localization.t('mutation.createEngagement.unauthorized'))

		await this.#pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${nextEngagement.org_id}`, {
			action: 'CREATED',
			message: this.#localization.t('mutation.createEngagement.success'),
			engagement: createGQLEngagement(nextEngagement),
			status: StatusType.Success
		})

		// Create two actions. one for create one for assignment
		// Engagement create action
		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: this.#localization.t('mutation.createEngagement.actions.createRequest'),
				orgId: body.orgId,
				userId: user
			})
		]

		if (body.userId && user !== body.userId) {
			// Get user to be assigned
			const userToAssign = await this.#users.itemById(body.userId)
			if (!userToAssign.item) {
				throw Error(this.#localization.t('mutation.createEngagement.unableToAssign'))
			}

			// User assignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.#localization.t('mutation.createEngagement.actions.assignedRequest', {
						username: userToAssign.item.user_name
					}),
					orgId: body.orgId,
					userId: user,
					taggedUserId: userToAssign.item.id
				})
			)

			// Send assigned user a mention
			if (userToAssign.item) {
				const dbMention = createDBMention(
					nextEngagement.id,
					identity?.id as string,
					undefined,
					actionsToAssign[0].comment
				)

				try {
					await this.#users.updateItem(
						{ id: userToAssign.item.id },
						{ $push: { mentions: dbMention } }
					)
				} catch (error) {
					throw error
				}

				// Publish changes to subscribed user
				await this.#pubsub.publish(`USER_MENTION_UPDATES_${userToAssign.item.id}`, {
					action: 'CREATED',
					message: this.#localization.t('mutation.addEngagementAction.success'),
					mention: createGQLMention(dbMention),
					status: StatusType.Success
				})
			}

			// Send fcm message if token is present on user
			if (userToAssign.item.fcm_token) {
				this.#notifier.assignedRequest(userToAssign.item.fcm_token)
			}
		}

		if (body.userId && user === body.userId) {
			// Create claimed action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.#localization.t('mutation.createEngagement.actions.claimedRequest'),
					orgId: body.orgId,
					userId: user,
					taggedUserId: user
				})
			)

			// Set fcm token if present
			console.log('context.auth.identity?.fcm_token', identity?.fcm_token)
			if (identity?.fcm_token) {
				this.#notifier.assignedRequest(identity.fcm_token)
			}
		}

		// Assign new action to engagement
		await this.#engagements.updateItem(
			{ id: nextEngagement.id },
			{
				$push: {
					actions: {
						$each: actionsToAssign
					}
				}
			}
		)

		// Update the object to be returned to the client
		nextEngagement.actions = [...nextEngagement.actions, ...actionsToAssign].sort(sortByDate)

		// Return created engagement
		return {
			engagement: createGQLEngagement(nextEngagement),
			message: this.#localization.t('mutation.createEngagement.success'),
			status: StatusType.Success
		}
	}
}
