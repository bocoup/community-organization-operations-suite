/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationSetUserPasswordArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { validatePasswordHash } from '~utils'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

export class SetUserPasswordInteractor
	implements Interactor<MutationSetUserPasswordArgs, UserResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly authenticator: Authenticator
	) {}

	public async execute(
		{ oldPassword, newPassword }: MutationSetUserPasswordArgs,
		{ identity: user }: RequestContext
	): Promise<UserResponse> {
		if (!user) {
			return new FailedResponse(this.localization.t('mutation.setUserPassword.notLoggedIn'))
		}

		const isPasswordValid = await validatePasswordHash(oldPassword, user.password)
		if (!isPasswordValid) {
			return new FailedResponse(this.localization.t('mutation.setUserPassword.invalidPassword'))
		}

		const response = await this.authenticator.setPassword(user, newPassword)

		if (!response) {
			return new FailedResponse(this.localization.t('mutation.setUserPassword.resetError'))
		}

		return new SuccessUserResponse(
			this.localization.t('mutation.setUserPassword.success'),
			createGQLUser(user, true)
		)
	}
}
