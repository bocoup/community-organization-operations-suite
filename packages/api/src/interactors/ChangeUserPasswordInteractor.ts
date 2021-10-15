/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ChangeUserPasswordInput,
	ForgotUserPasswordResponse
} from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessForgotUserPasswordResponse } from '~utils/response'

export class ChangeUserPasswordInteractor
	implements Interactor<ChangeUserPasswordInput, ForgotUserPasswordResponse>
{
	#localization: Localization
	#users: UserCollection
	#authenticator: Authenticator

	public constructor(
		localization: Localization,
		authenticator: Authenticator,
		users: UserCollection
	) {
		this.#localization = localization
		this.#authenticator = authenticator
		this.#users = users
	}

	public async execute(body: ChangeUserPasswordInput): Promise<ForgotUserPasswordResponse> {
		const { email, newPassword } = body
		const user = await this.#users.item({ email })

		if (!user.item) {
			return new FailedResponse(this.#localization.t('mutation.forgotUserPassword.userNotFound'))
		}
		const response = await this.#authenticator.setPassword(user.item, newPassword)

		if (!response) {
			return new FailedResponse(this.#localization.t('mutation.forgotUserPassword.resetError'))
		}

		await this.#users.updateItem({ email: email }, { $unset: { forgot_password_token: '' } })

		return new SuccessForgotUserPasswordResponse(
			this.#localization.t('mutation.forgotUserPassword.success')
		)
	}
}
