/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCreateEngagementArgs,
	EngagementResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import {
	createDBAction,
	createDBEngagement,
	createDBMention,
	createGQLEngagement,
	createGQLMention
} from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate, createLogger } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { Publisher } from '~components/Publisher'
import { EngagementCollection } from '~db/EngagementCollection'
import { UserCollection } from '~db/UserCollection'
import { Notifications } from '~components/Notifications'
import { Telemetry } from '~components/Telemetry'
import { DbAction } from '~db/types'

const logger = createLogger('interactors:create-engagement', true)

@singleton()
export class CreateEngagementInteractor
	implements Interactor<unknown, MutationCreateEngagementArgs, EngagementResponse>
{
	public constructor(
		private localization: Localization,
		private publisher: Publisher,
		private engagements: EngagementCollection,
		private users: UserCollection,
		private notifier: Notifications,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ engagement }: MutationCreateEngagementArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		// Create a dbabase object from input values
		const nextEngagement = createDBEngagement({ ...engagement }, identity.id)

		// Insert engagement into enagements collection
		await this.engagements.insertItem(nextEngagement)

		// User who created the request
		const user = identity?.id
		if (!user) throw Error(this.localization.t('mutation.createEngagement.unauthorized', locale))

		await this.publisher.publishEngagementCreated(
			nextEngagement.org_id,
			createGQLEngagement(nextEngagement),
			locale
		)

		// Create two actions. one for create one for assignment
		// Engagement create action
		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: this.localization.t('mutation.createEngagement.actions.createRequest', locale),
				orgId: engagement.orgId,
				userId: user
			})
		]

		if (engagement.userId && user !== engagement.userId) {
			// Get user to be assigned
			const userToAssign = await this.users.itemById(engagement.userId)
			if (!userToAssign.item) {
				throw Error(this.localization.t('mutation.createEngagement.unableToAssign', locale))
			}

			// User assignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.localization.t(
						'mutation.createEngagement.actions.assignedRequest',
						locale,
						{
							username: userToAssign.item.user_name
						}
					),
					orgId: engagement.orgId,
					userId: user,
					taggedUserId: userToAssign.item.id
				})
			)

			// Send assigned user a mention
			if (userToAssign.item) {
				const dbMention = createDBMention(
					{
						engagementId: nextEngagement.id,
						createdBy: identity?.id as string,
						createdDate: new Date().toISOString(),
						message: actionsToAssign[0].comment
					},
					identity.id
				)

				try {
					await this.users.addMention(userToAssign.item, dbMention)
				} catch (error) {
					throw error
				}

				// Publish changes to subscribed user
				await this.publisher.publishMention(
					userToAssign.item.id,
					createGQLMention(dbMention),
					locale
				)
			}

			// Send fcm message if token is present on user
			if (userToAssign.item.fcm_token) {
				this.notifier.assignedRequest(userToAssign.item.fcm_token, locale)
			}
		}

		if (engagement.userId && user === engagement.userId) {
			// Create claimed action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.localization.t('mutation.createEngagement.actions.claimedRequest', locale),
					orgId: engagement.orgId,
					userId: user,
					taggedUserId: user
				})
			)

			// Set fcm token if present
			logger('context.auth.identity?.fcm_token', identity?.fcm_token)
			if (identity?.fcm_token) {
				this.notifier.assignedRequest(identity.fcm_token, locale)
			}
		}

		// Assign new action to engagement
		await this.engagements.updateItem(
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
		this.telemetry.trackEvent('CreateEngagement')
		return new SuccessEngagementResponse(
			this.localization.t('mutation.createEngagement.success', locale),
			createGQLEngagement(nextEngagement)
		)
	}
}
