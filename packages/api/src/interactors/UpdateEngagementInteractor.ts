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
import { Localization } from '~components'
import { DbAction, DbEngagement, DbUser, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor } from '~types'
import { sortByDate } from '~utils'

export class UpdateEngagementInteractor implements Interactor<EngagementInput, EngagementResponse> {
	#localization: Localization
	#pubsub: PubSub
	#engagements: EngagementCollection
	#users: UserCollection

	public constructor(
		localization: Localization,
		pubsub: PubSub,
		engagements: EngagementCollection,
		users: UserCollection
	) {
		this.#localization = localization
		this.#pubsub = pubsub
		this.#engagements = engagements
		this.#users = users
	}

	public async execute(body: EngagementInput, identity: DbUser): Promise<EngagementResponse> {
		if (!body?.engagementId) {
			throw Error(this.#localization.t('mutation.updateEngagement.noRequestId'))
		}

		const result = await this.#engagements.itemById(body.engagementId)
		if (!result.item) {
			throw Error(this.#localization.t('mutation.updateEngagement.requestNotFound'))
		}

		// User who created the request
		const user = identity?.id
		if (!user) throw Error(this.#localization.t('mutation.updateEngagement.unauthorized'))

		const current = result.item

		const changedItems: DbEngagement = {
			...current,
			title: body.title,
			contacts: body.contactIds,
			description: body.description,
			user_id: body.userId || undefined,
			tags: body.tags || []
		}

		await Promise.all([
			this.#engagements.updateItem(
				{ id: current.id },
				{
					$set: changedItems
				}
			),
			this.#pubsub.publish(`ORG_ENGAGEMENT_UPDATES_${changedItems.org_id}`, {
				action: 'UPDATED',
				message: this.#localization.t('mutation.updateEngagement.success'),
				engagement: createGQLEngagement(changedItems),
				status: StatusType.Success
			})
		])

		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: this.#localization.t('mutation.updateEngagement.actions.updatedRequest'),
				orgId: body.orgId,
				userId: user
			})
		]

		if (body.userId && body.userId !== current.user_id && user !== body.userId) {
			// Get user to be assigned
			const userToAssign = await this.#users.itemById(body.userId)

			if (!userToAssign.item) {
				actionsToAssign.unshift(
					createDBAction({
						comment: this.#localization.t('mutation.updateEngagement.actions.unassignRequest'),
						orgId: body.orgId,
						userId: user,
						taggedUserId: undefined
					})
				)
			}

			// Create reassignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.#localization.t('mutation.updateEngagement.actions.reassignRequest', {
						username: userToAssign?.item?.user_name
					}),
					orgId: body.orgId,
					userId: user,
					taggedUserId: userToAssign?.item?.id
				})
			)
		}

		// Assign new action to engagement
		await this.#engagements.updateItem(
			{ id: changedItems.id },
			{
				$push: {
					actions: {
						$each: actionsToAssign
					}
				}
			}
		)

		// Update the object to be returned to the client
		changedItems.actions = [...changedItems.actions, ...actionsToAssign].sort(sortByDate)

		// Return created engagement
		return {
			engagement: createGQLEngagement(changedItems),
			message: this.#localization.t('mutation.updateEngagement.success'),
			status: StatusType.Success
		}
	}
}
