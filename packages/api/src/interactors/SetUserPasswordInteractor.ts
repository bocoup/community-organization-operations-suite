/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationSetUserPasswordArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { validatePasswordHash } from '~utils'
import { SuccessUserResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class SetUserPasswordInteractor
	implements Interactor<MutationSetUserPasswordArgs, UserResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection,
		private readonly telemetry: Telemetry
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
