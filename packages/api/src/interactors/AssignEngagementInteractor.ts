/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	EngagementResponse,
	MutationAssignEngagementArgs
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization, Notifications } from '~components'
import { Publisher } from '~components/Publisher'
import { DbAction, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createGQLEngagement, createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate, createLogger } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'

const logger = createLogger('interactors:assign-engagement', true)

export class AssignEngagementInteractor
	implements Interactor<MutationAssignEngagementArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly publisher: Publisher,
		private readonly engagements: EngagementCollection,
		private readonly users: UserCollection,
		private readonly notifier: Notifications
	) {}

	public async execute(
		{ engagementId: id, userId }: MutationAssignEngagementArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		const [engagement, user] = await Promise.all([
			this.engagements.itemById(id),
			this.users.itemById(userId)
		])
		if (!user.item) {
			throw new UserInputError(
				this.localization.t('mutation.assignEngagement.userNotFound', locale)
			)
		}
		if (!engagement.item) {
			throw new UserInputError(
				this.localization.t('mutation.assignEngagement.requestNotFound', locale)
			)
		}

		// Set assignee
		await this.engagements.updateItem({ id }, { $set: { user_id: userId } })

		// Create action for assignment or claimed
		let dbAction: DbAction | undefined = undefined
		const currentUserId = identity?.id

		if (currentUserId && userId !== currentUserId) {
			// Create assignment action
			dbAction = createDBAction({
				comment: this.localization.t('mutation.assignEngagement.actions.assignedRequest', locale, {
					username: user.item.user_name
				}),
				orgId: engagement.item.org_id,
				userId: user.item.id,
				taggedUserId: user.item.id
			})

			// Send the user a push notification
			if (user.item.fcm_token) {
				logger('attempting to send message to ', user.item.fcm_token)
				this.notifier.assignedRequest(user.item.fcm_token, locale)
			}
		}

		if (currentUserId && userId === currentUserId) {
			// Create claimed action
			dbAction = createDBAction({
				comment: this.localization.t('mutation.assignEngagement.actions.claimedRequest', locale),
				orgId: engagement.item.org_id,
				userId: currentUserId,
				taggedUserId: currentUserId
			})
		}

		if (dbAction) {
			await this.engagements.updateItem({ id }, { $push: { actions: dbAction } })
			engagement.item.actions = [...engagement.item.actions, dbAction].sort(sortByDate)
		}

		const updatedEngagement = {
			...createGQLEngagement(engagement.item),
			user: createGQLUser(user.item, true)
		}

		// Publish changes to websocketk connection
		await this.publisher.publishEngagementAssigned(
			engagement.item.org_id,
			updatedEngagement,
			locale
		)

		// Return updated engagement
		return new SuccessEngagementResponse(
			this.localization.t('mutation.assignEngagement.success', locale),
			updatedEngagement
		)
	}
}
