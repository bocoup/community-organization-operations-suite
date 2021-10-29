/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	VoidResponse,
	MutationExecutePasswordResetArgs
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { TokenIssuer } from '~components/TokenIssuer'
import { UserCollection } from '~db/UserCollection'
import { Telemetry } from '~components/Telemetry'

@singleton()
export class ExecutePasswordResetInteractor
	implements Interactor<MutationExecutePasswordResetArgs, VoidResponse>
{
	public constructor(
		private localization: Localization,
		private tokenIssuer: TokenIssuer,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		{ resetToken, newPassword }: MutationExecutePasswordResetArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		const token = await this.tokenIssuer.verifyPasswordResetToken(resetToken)
		if (!token) {
			throw new UserInputError(
				this.localization.t('mutation.forgotUserPassword.invalidToken', locale)
			)
		}
		const { item: user } = await this.users.itemById(token.user_id)
		if (!user) {
			throw new UserInputError(
				this.localization.t('mutation.forgotUserPassword.userNotFound', locale)
			)
		}
		if (token == null || resetToken !== user.forgot_password_token) {
			await this.users.clearPasswordResetForUser(user)
			throw new UserInputError(
				this.localization.t('mutation.forgotUserPassword.invalidTokenExpired', locale)
			)
		}

		await this.users.savePassword(user, newPassword)
		this.telemetry.trackEvent('ExecutePasswordReset')
		return new SuccessVoidResponse(
			this.localization.t('mutation.forgotUserPassword.success', locale)
		)
	}
}
