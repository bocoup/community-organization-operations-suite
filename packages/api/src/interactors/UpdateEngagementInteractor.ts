/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementInput, EngagementResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { Publisher } from '~components/Publisher'
import { DbAction, DbEngagement, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { FailedResponse, SuccessEngagementResponse } from '~utils/response'

export class UpdateEngagementInteractor implements Interactor<EngagementInput, EngagementResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly publisher: Publisher,
		private readonly engagements: EngagementCollection,
		private readonly users: UserCollection
	) {}

	public async execute(
		body: EngagementInput,
		{ identity }: RequestContext
	): Promise<EngagementResponse> {
		if (!body?.engagementId) {
			return new FailedResponse(this.localization.t('mutation.updateEngagement.noRequestId'))
		}

		const result = await this.engagements.itemById(body.engagementId)
		if (!result.item) {
			return new FailedResponse(this.localization.t('mutation.updateEngagement.requestNotFound'))
		}

		// User who created the request
		const user = identity?.id
		if (!user) {
			return new FailedResponse(this.localization.t('mutation.updateEngagement.unauthorized'))
		}

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
			this.engagements.updateItem(
				{ id: current.id },
				{
					$set: changedItems
				}
			),
			this.publisher.publishEngagementUpdated(
				changedItems.org_id,
				createGQLEngagement(changedItems)
			)
		])

		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: this.localization.t('mutation.updateEngagement.actions.updatedRequest'),
				orgId: body.orgId,
				userId: user
			})
		]

		if (body.userId && body.userId !== current.user_id && user !== body.userId) {
			// Get user to be assigned
			const userToAssign = await this.users.itemById(body.userId)

			if (!userToAssign.item) {
				actionsToAssign.unshift(
					createDBAction({
						comment: this.localization.t('mutation.updateEngagement.actions.unassignRequest'),
						orgId: body.orgId,
						userId: user,
						taggedUserId: undefined
					})
				)
			}

			// Create reassignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.localization.t('mutation.updateEngagement.actions.reassignRequest', {
						username: userToAssign?.item?.user_name
					}),
					orgId: body.orgId,
					userId: user,
					taggedUserId: userToAssign?.item?.id
				})
			)
		}

		// Assign new action to engagement
		await this.engagements.updateItem(
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
		return new SuccessEngagementResponse(
			this.localization.t('mutation.updateEngagement.success'),
			createGQLEngagement(changedItems)
		)
	}
}
