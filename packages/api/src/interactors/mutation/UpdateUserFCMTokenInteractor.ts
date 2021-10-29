/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateUserFcmTokenArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { UserCollection } from '~db/UserCollection'
import { Telemetry } from '~components/Telemetry'
const logger = createLogger('interactors:update-user-fcm-token')

@singleton()
export class UpdateUserFCMTokenInteractor
	implements Interactor<unknown, MutationUpdateUserFcmTokenArgs, VoidResponse>
{
	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
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
