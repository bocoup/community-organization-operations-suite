/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationAuthenticateArgs,
	AuthenticationResponse
} from '@cbosuite/schema/dist/provider-types'
import { AuthenticationError } from 'apollo-server-errors'
import isEmpty from 'lodash/isEmpty'
import { singleton } from 'tsyringe'
import { Authenticator, Localization, Telemetry } from '~components'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessAuthenticationResponse } from '~utils/response'

@singleton()
export class AuthenticateInteractor
	implements Interactor<MutationAuthenticateArgs, AuthenticationResponse>
{
	public constructor(
		private readonly authenticator: Authenticator,
		private readonly localization: Localization,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ username, password }: MutationAuthenticateArgs,
		{ locale }: RequestContext
	): Promise<AuthenticationResponse> {
		if (!isEmpty(username) && !isEmpty(password)) {
			const { user, token } = await this.authenticator.authenticateBasic(username, password)
			if (user) {
				this.telemetry.trackEvent('Authenticate')
				return new SuccessAuthenticationResponse(
					this.localization.t('mutation.authenticate.success', locale),
					createGQLUser(user, true),
					token
				)
			}
		}
		throw new AuthenticationError(this.localization.t('mutation.authenticate.failed', locale))
	}
}
