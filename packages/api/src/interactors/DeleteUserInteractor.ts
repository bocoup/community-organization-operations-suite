/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatusType, UserIdInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import {
	EngagementCollection,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection
} from '~db'
import { Interactor, RequestContext } from '~types'

export class DeleteUserInteractor implements Interactor<UserIdInput, VoidResponse> {
	#localization: Localization
	#users: UserCollection
	#userTokens: UserTokenCollection
	#orgs: OrganizationCollection
	#engagements: EngagementCollection
	public constructor(
		localization: Localization,
		users: UserCollection,
		userTokens: UserTokenCollection,
		orgs: OrganizationCollection,
		engagements: EngagementCollection
	) {
		this.#localization = localization
		this.#users = users
		this.#userTokens = userTokens
		this.#orgs = orgs
		this.#engagements = engagements
	}

	public async execute(
		{ userId }: UserIdInput,
		{ identity }: RequestContext
	): Promise<VoidResponse> {
		// Delete user
		try {
			await this.#users.deleteItem({ id: userId })
		} catch (error) {
			return {
				message: this.#localization.t('mutation.deleteUser.fail'),
				status: StatusType.Failed
			}
		}

		// Remove all engagements with user
		try {
			await this.#engagements.deleteItems({ user_id: userId })
		} catch (error) {
			return {
				message: this.#localization.t('mutation.deleteUser.fail'),
				status: StatusType.Failed
			}
		}

		// Remove all remaining engagement actions with user
		const remainingEngagementsOnOrg = await this.#engagements.items(
			{},
			{ org_id: identity?.roles[0]?.org_id }
		)
		if (remainingEngagementsOnOrg.items)
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
					await this.#engagements.updateItem(
						{ id: engagement.id },
						{
							$set: {
								actions: newActions
							}
						}
					)
				}
			}

		// Remove user from organization
		const orgWithUser = await this.#orgs.item({ id: identity?.roles[0].org_id })
		if (orgWithUser.item) {
			const nextUsers = orgWithUser.item.users.filter((orgUserId) => orgUserId !== userId)
			await this.#orgs.updateItem({ id: identity?.roles[0].org_id }, { $set: { users: nextUsers } })
		}

		// Remove user tokens
		await this.#userTokens.deleteItems({ user: userId })

		// Return success
		return {
			message: this.#localization.t('mutation.deleteUser.success'),
			status: StatusType.Success
		}

		// Archiving:
		// Set status to archived

		// Remove user token

		// update auth to not allow archived users to sign in
	}
}
