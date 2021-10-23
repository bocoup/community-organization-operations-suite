/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationRemoveUserFromOrganizationArgs,
	VoidResponse
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { EngagementCollection, UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class RemoveUserFromOrganizationInteractor
	implements Interactor<MutationRemoveUserFromOrganizationArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection,
		private readonly engagements: EngagementCollection
	) {}

	public async execute(
		{ userId, orgId }: MutationRemoveUserFromOrganizationArgs,
		{ identity }: RequestContext
	): Promise<VoidResponse> {
		const { item: user } = await this.users.itemById(userId)
		if (!user) {
			return new FailedResponse(this.localization.t('mutation.deleteUser.fail'))
		}

		// Remove org permissinos
		const newRoles = user.roles.filter((r) => r.org_id !== orgId)
		try {
			if (newRoles.length === 0) {
				await this.users.deleteItem({ id: userId })
			} else {
				await this.users.updateItem({ id: userId }, { $set: { roles: newRoles } })
			}

			// Remove all engagements with user
			await this.engagements.deleteItems({ user_id: userId })

			// Remove all remaining engagement actions with user
			const { items: remainingEngagements } = await this.engagements.items({}, { org_id: orgId })
			if (remainingEngagements) {
				for (const engagement of remainingEngagements) {
					const newActions = []
					let isUpdated = false

					for (const action of engagement.actions) {
						// If action was created by user, do not added it to the newActions list
						if (action.user_id === userId) {
							isUpdated = true
							continue
						}
						// If action tags the user, remove the tag
						if (action.tagged_user_id === userId) {
							action.tagged_user_id = undefined
							isUpdated = true
						}
						// Add the action back to the engagment actions
						newActions.push(action)
					}

					// Only update the engagement actions if a user was removed
					if (isUpdated) {
						await this.engagements.updateItem(
							{ id: engagement.id },
							{
								$set: {
									actions: newActions
								}
							}
						)
					}
				}
			}
		} catch (error) {
			return new FailedResponse(this.localization.t('mutation.deleteUser.fail'))
		}

		try {
		} catch (error) {
			return new FailedResponse(this.localization.t('mutation.deleteUser.fail'))
		}

		try {
		} catch (error) {
			return new FailedResponse(this.localization.t('mutation.deleteUser.fail'))
		}

		// Return success
		return new SuccessVoidResponse(this.localization.t('mutation.deleteUser.success'))
	}
}
