/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationDeleteUserArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { EngagementCollection, UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class DeleteUserInteractor implements Interactor<MutationDeleteUserArgs, VoidResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection,
		private readonly engagements: EngagementCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ userId }: MutationDeleteUserArgs,
		{ identity, locale }: RequestContext
	): Promise<VoidResponse> {
		try {
			// Delete user
			await this.users.deleteItem({ id: userId })

			// Remove all engagements with user
			await this.engagements.deleteItems({ user_id: userId })

			// Remove all remaining engagement actions with user
			const remainingEngagementsOnOrg = await this.engagements.items(
				{},
				{ org_id: identity?.roles[0]?.org_id }
			)
			if (remainingEngagementsOnOrg.items) {
				for (const engagement of remainingEngagementsOnOrg.items) {
					const newActions = []
					let removedUser = false

					for (const action of engagement.actions) {
						// If action was created by user, do not added it to the newActions list
						if (action.user_id === userId) {
							removedUser = true
							continue
						}

						// If action tags the user, remove the tag
						if (action.tagged_user_id === userId) {
							action.tagged_user_id = undefined
							removedUser = true
						}

						// Add the action back to the engagment actions
						newActions.push(action)
					}

					// Only update the engagement actions if a user was removed
					if (removedUser) {
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
			throw new Error(this.localization.t('mutation.deleteUser.fail', locale))
		}

		// Return success
		this.telemetry.trackEvent('DeleteUser')
		return new SuccessVoidResponse(this.localization.t('mutation.deleteUser.success', locale))
	}
}
