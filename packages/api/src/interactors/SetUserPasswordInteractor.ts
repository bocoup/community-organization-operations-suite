/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationSetUserPasswordArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { validatePasswordHash } from '~utils'
import { SuccessUserResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { UserCollection } from '~db/UserCollection'
import { Telemetry } from '~components/Telemetry'

@singleton()
export class SetUserPasswordInteractor
	implements Interactor<MutationSetUserPasswordArgs, UserResponse>
{
	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		{ oldPassword, newPassword }: MutationSetUserPasswordArgs,
		{ identity: user, locale }: RequestContext
	): Promise<UserResponse> {
		if (!user) {
			throw new UserInputError(this.localization.t('mutation.setUserPassword.notLoggedIn', locale))
		}

		const isPasswordValid = await validatePasswordHash(oldPassword, user.password)
		if (!isPasswordValid) {
			throw new UserInputError(
				this.localization.t('mutation.setUserPassword.invalidPassword', locale)
			)
		}

		const response = await this.users.savePassword(user, newPassword)
		if (response !== 1) {
			throw new Error(this.localization.t('mutation.setUserPassword.resetError', locale))
		}

		this.telemetry.trackEvent('SetUserPassword')
		return new SuccessUserResponse(
			this.localization.t('mutation.setUserPassword.success', locale),
			createGQLUser(user, true)
		)
	}
}
