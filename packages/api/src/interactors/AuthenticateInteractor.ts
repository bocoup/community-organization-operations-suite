/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AuthenticationInput, AuthenticationResponse } from '@cbosuite/schema/dist/provider-types'
import isEmpty from 'lodash/isEmpty'
import { Authenticator, Localization } from '~components'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessAuthenticationResponse } from '~utils/response'

export class AuthenticateInteractor
	implements Interactor<AuthenticationInput, AuthenticationResponse>
{
	#authenticator: Authenticator
	#localization: Localization

	public constructor(authenticator: Authenticator, localization: Localization) {
		this.#authenticator = authenticator
		this.#localization = localization
	}

	public async execute({
		username,
		password
	}: AuthenticationInput): Promise<AuthenticationResponse> {
		if (!isEmpty(username) && !isEmpty(password)) {
			const { user, token } = await this.#authenticator.authenticateBasic(username, password)
			if (user) {
				return new SuccessAuthenticationResponse(
					this.#localization.t('mutation.authenticate.success'),
					createGQLUser(user),
					token
				)
			}
		}
		return new FailedResponse(this.#localization.t('mutation.authenticate.failed'))
	}
}
