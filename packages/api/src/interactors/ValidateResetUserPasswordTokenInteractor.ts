/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	VoidResponse,
	MutationValidateResetUserPasswordTokenArgs
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { TokenIssuer } from '~components/TokenIssuer'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class ValidateResetUserPasswordTokenInteractor
	implements Interactor<MutationValidateResetUserPasswordTokenArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly tokenIssuer: TokenIssuer,
		private readonly users: UserCollection
	) {}

	public async execute({
		resetToken,
		email
	}: MutationValidateResetUserPasswordTokenArgs): Promise<VoidResponse> {
		const { item: user } = await this.users.item({ email })

		if (!user) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.userNotFound'))
		}

		const token = await this.tokenIssuer.verifyPasswordResetToken(resetToken)

		if (token == null || resetToken !== user.forgot_password_token) {
			await this.users.updateItem({ email }, { $unset: { forgot_password_token: '' } })
			return new FailedResponse(
				this.localization.t('mutation.forgotUserPassword.invalidTokenExpired')
			)
		}

		return new SuccessVoidResponse(this.localization.t('mutation.forgotUserPassword.success'))
	}
}
