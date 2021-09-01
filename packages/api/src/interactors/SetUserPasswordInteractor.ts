/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	PasswordChangeInput,
	StatusType,
	UserActionResponse
} from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { validatePassword } from '~utils'

export class SetUserPasswordInteractor
	implements Interactor<PasswordChangeInput, UserActionResponse>
{
	#localization: Localization
	#authenticator: Authenticator

	public constructor(localization: Localization, authenticator: Authenticator) {
		this.#localization = localization
		this.#authenticator = authenticator
	}

	public async execute(
		body: PasswordChangeInput,
		{ identity: user }: RequestContext
	): Promise<UserActionResponse> {
		const { oldPassword, newPassword } = body
		if (!user) {
			return {
				user: null,
				message: this.#localization.t('mutation.setUserPassword.notLoggedIn'),
				status: StatusType.Failed
			}
		}

		if (!validatePassword(oldPassword, user.password)) {
			return {
				user: null,
				message: this.#localization.t('mutation.setUserPassword.invalidPassword'),
				status: StatusType.Failed
			}
		}

		const response = await this.#authenticator.setPassword(user, newPassword)

		if (!response) {
			return {
				user: null,
				message: this.#localization.t('mutation.setUserPassword.resetError'),
				status: StatusType.Failed
			}
		}

		return {
			user: createGQLUser(user),
			message: this.#localization.t('mutation.setUserPassword.success'),
			status: StatusType.Success
		}
	}
}
