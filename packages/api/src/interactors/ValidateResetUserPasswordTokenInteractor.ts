/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	VoidResponse,
	ValidateResetUserPasswordTokenInput
} from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class ValidateResetUserPasswordTokenInteractor
	implements Interactor<ValidateResetUserPasswordTokenInput, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly authenticator: Authenticator,
		private readonly users: UserCollection
	) {}

	public async execute(body: ValidateResetUserPasswordTokenInput): Promise<VoidResponse> {
		const { email, resetToken } = body
		const user = await this.users.item({ email })

		if (!user.item) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.userNotFound'))
		}

		const isValid = await this.authenticator.verifyPasswordResetToken(resetToken)

		if (!isValid || resetToken !== user.item.forgot_password_token) {
			await this.users.updateItem({ email }, { $unset: { forgot_password_token: '' } })

			return new FailedResponse(
				this.localization.t('mutation.forgotUserPassword.invalidTokenExpired')
			)
		}

		return new SuccessVoidResponse(this.localization.t('mutation.forgotUserPassword.success'))
	}
}
