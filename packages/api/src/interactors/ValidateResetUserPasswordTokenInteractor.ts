/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ForgotUserPasswordResponse,
	StatusType,
	ValidateResetUserPasswordTokenInput
} from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'

export class ValidateResetUserPasswordTokenInteractor
	implements Interactor<ValidateResetUserPasswordTokenInput, ForgotUserPasswordResponse>
{
	#localization: Localization
	#authenticator: Authenticator
	#users: UserCollection

	public constructor(
		localization: Localization,
		authenticator: Authenticator,
		users: UserCollection
	) {
		this.#localization = localization
		this.#authenticator = authenticator
		this.#users = users
	}

	public async execute(
		body: ValidateResetUserPasswordTokenInput
	): Promise<ForgotUserPasswordResponse> {
		const { email, resetToken } = body
		const user = await this.#users.item({ email })

		if (!user.item) {
			return {
				status: StatusType.Failed,
				message: this.#localization.t('mutation.forgotUserPassword.userNotFound')
			}
		}

		const isValid = await this.#authenticator.verifyPasswordResetToken(resetToken)

		if (!isValid || resetToken !== user.item.forgot_password_token) {
			await this.#users.updateItem({ email: email }, { $unset: { forgot_password_token: '' } })

			return {
				status: StatusType.Failed,
				message: this.#localization.t('mutation.forgotUserPassword.invalidTokenExpired')
			}
		}

		return {
			status: StatusType.Success,
			message: this.#localization.t('mutation.forgotUserPassword.success')
		}
	}
}
