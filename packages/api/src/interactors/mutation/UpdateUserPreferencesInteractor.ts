/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { singleton } from 'tsyringe'
import { Interactor, RequestContext } from '~types'
import {
	MutationUpdateUserPreferencesArgs,
	VoidResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components/Localization'
import { UserCollection } from '~db/UserCollection'
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
		const userExist = await this.users.exist({ id: userId })
		if (!userExist) {
			throw new UserInputError(this.localization.t('mutation.updateUser.userNotFound', locale))
		}

		// Update the preferences
		this.users.setPreferences(userId, preferences)

		return new SuccessVoidResponse(this.localization.t('mutation.updateUser.success', locale))
	}
}
