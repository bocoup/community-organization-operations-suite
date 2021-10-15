/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PasswordChangeInput, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { validatePassword } from '~utils'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

export class SetUserPasswordInteractor implements Interactor<PasswordChangeInput, UserResponse> {
	#localization: Localization
	#authenticator: Authenticator

	public constructor(localization: Localization, authenticator: Authenticator) {
		this.#localization = localization
		this.#authenticator = authenticator
	}

	public async execute(
		body: PasswordChangeInput,
		{ identity: user }: RequestContext
	): Promise<UserResponse> {
		const { oldPassword, newPassword } = body
		if (!user) {
			return new FailedResponse(this.#localization.t('mutation.setUserPassword.notLoggedIn'))
		}

		if (!validatePassword(oldPassword, user.password)) {
			return new FailedResponse(this.#localization.t('mutation.setUserPassword.invalidPassword'))
		}

		const response = await this.#authenticator.setPassword(user, newPassword)

		if (!response) {
			return new FailedResponse(this.#localization.t('mutation.setUserPassword.resetError'))
		}

		return new SuccessUserResponse(
			this.#localization.t('mutation.setUserPassword.success'),
			createGQLUser(user)
		)
	}
}
