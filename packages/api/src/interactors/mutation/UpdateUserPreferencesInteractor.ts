/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { singleton } from 'tsyringe'
import type { Interactor, RequestContext } from '~types'
import type {
	MutationUpdateUserPreferencesArgs,
	VoidResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import type { Localization } from '~components/Localization'
import type { UserCollection } from '~db/UserCollection'
import { SuccessVoidResponse } from '~utils/response'

@singleton()
export class UpdateUserPreferencesInteractor
	implements Interactor<unknown, MutationUpdateUserPreferencesArgs, VoidResponse>
{
	public constructor(private localization: Localization, private users: UserCollection) {}

	public async execute(
		_: unknown,
		{ userId, preferences }: MutationUpdateUserPreferencesArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		// Fetch the user from the database
		const result = await this.users.itemById(userId)
		const dbUser = result?.item

		if (!dbUser) {
			throw new UserInputError(this.localization.t('mutation.updateUser.userNotFound', locale))
		}

		// Update the preferences
		this.users.setPreferences(dbUser, preferences)

		return new SuccessVoidResponse(this.localization.t('mutation.updateUser.success', locale))
	}
}
