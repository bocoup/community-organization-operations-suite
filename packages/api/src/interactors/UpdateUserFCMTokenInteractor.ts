/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateUserFcmTokenArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { SuccessVoidResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'
const logger = createLogger('interactors:update-user-fcm-token')

export class UpdateUserFCMTokenInteractor
	implements Interactor<MutationUpdateUserFcmTokenArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ fcmToken }: MutationUpdateUserFcmTokenArgs,
		{ identity, locale }: RequestContext
	): Promise<VoidResponse> {
		// TODO: expire fcm tokens
		try {
			await this.users.setFcmTokenForUser(identity!, fcmToken)
		} catch (error) {
			logger('error updating token', error)
			throw new Error(this.localization.t('mutation.updateUserFCMToken.userFCMTokenFailed', locale))
		}

		this.telemetry.trackEvent('UpdateUserFCMToken')
		return new SuccessVoidResponse(
			this.localization.t('mutation.updateUserFCMToken.success', locale)
		)
	}
}
