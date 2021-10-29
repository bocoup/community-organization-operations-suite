/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationUpdateEngagementArgs,
	EngagementResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { Localization } from '~components'
import { Publisher } from '~components/Publisher'
import { DbAction, DbEngagement, EngagementCollection, UserCollection } from '~db'
import { createDBAction, createGQLEngagement } from '~dto'
import { Interactor, RequestContext } from '~types'
import { sortByDate } from '~utils'
import { SuccessEngagementResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class UpdateEngagementInteractor
	implements Interactor<MutationUpdateEngagementArgs, EngagementResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly publisher: Publisher,
		private readonly engagements: EngagementCollection,
		private readonly users: UserCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ engagement }: MutationUpdateEngagementArgs,
		{ identity, locale }: RequestContext
	): Promise<EngagementResponse> {
		if (!engagement?.engagementId) {
			throw new UserInputError(this.localization.t('mutation.updateEngagement.noRequestId', locale))
		}

		const result = await this.engagements.itemById(engagement.engagementId)
		if (!result.item) {
			throw new UserInputError(
				this.localization.t('mutation.updateEngagement.requestNotFound', locale)
			)
		}

		// User who created the request
		const user = identity?.id
		if (!user) {
			throw new ForbiddenError(
				this.localization.t('mutation.updateEngagement.unauthorized', locale)
			)
		}

		const current = result.item

		const changedItems: DbEngagement = {
			...current,
			title: engagement.title,
			contacts: engagement.contactIds,
			description: engagement.description,
			user_id: engagement.userId || undefined,
			tags: engagement.tags || []
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
				createGQLEngagement(changedItems),
				locale
			)
		])

		const actionsToAssign: DbAction[] = [
			createDBAction({
				comment: this.localization.t('mutation.updateEngagement.actions.updatedRequest', locale),
				orgId: engagement.orgId,
				userId: user
			})
		]

		if (engagement.userId && engagement.userId !== current.user_id && user !== engagement.userId) {
			// Get user to be assigned
			const userToAssign = await this.users.itemById(engagement.userId)

			if (!userToAssign.item) {
				actionsToAssign.unshift(
					createDBAction({
						comment: this.localization.t(
							'mutation.updateEngagement.actions.unassignRequest',
							locale
						),
						orgId: engagement.orgId,
						userId: user,
						taggedUserId: undefined
					})
				)
			}

			// Create reassignment action
			actionsToAssign.unshift(
				createDBAction({
					comment: this.localization.t(
						'mutation.updateEngagement.actions.reassignRequest',
						locale,
						{
							username: userToAssign?.item?.user_name
						}
					),
					orgId: engagement.orgId,
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
		this.telemetry.trackEvent('UpdateEngagement')
		return new SuccessEngagementResponse(
			this.localization.t('mutation.updateEngagement.success', locale),
			createGQLEngagement(changedItems)
		)
	}
}
