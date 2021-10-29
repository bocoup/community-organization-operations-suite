/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationCreateEngagementArgs,
	EngagementResponse
} from '@cbosuite/schema/dist/provider-types'
import { Localization, Notifications } from '~components'
import { Publisher } from '~components/Publisher'
import { DbAction, EngagementCollection, UserCollection } from '~db'
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
import { Telemetry } from '~components/Telemetry'

const logger = createLogger('interactors:create-engagement', true)

export class CreateEngagementInteractor
	implements Interactor<MutationCreateEngagementArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly publisher: Publisher,
		private readonly engagements: EngagementCollection,
		private readonly users: UserCollection,
		private readonly notifier: Notifications,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ engagement }: MutationCreateEngagementArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		// Create a dbabase object from input values
		const nextEngagement = createDBEngagement({ ...engagement })

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
					nextEngagement.id,
					identity?.id as string,
					undefined,
					actionsToAssign[0].comment
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
