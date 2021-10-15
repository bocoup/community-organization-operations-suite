/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ChangeUserPasswordInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Authenticator, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class ChangeUserPasswordInteractor
	implements Interactor<ChangeUserPasswordInput, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly authenticator: Authenticator,
		private readonly users: UserCollection
	) {}

	public async execute(body: ChangeUserPasswordInput): Promise<VoidResponse> {
		const { email, newPassword } = body
		const user = await this.users.item({ email })

		if (!user.item) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.userNotFound'))
		}
		const response = await this.authenticator.setPassword(user.item, newPassword)

		if (!response) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.resetError'))
		}

		await this.users.updateItem({ email: email }, { $unset: { forgot_password_token: '' } })

		return new SuccessVoidResponse(this.localization.t('mutation.forgotUserPassword.success'))
	}
}
