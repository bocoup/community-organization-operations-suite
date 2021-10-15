/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UserFcmInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'
const logger = createLogger('interactors:update-user-fcm-token')

export class UpdateUserFCMTokenInteractor implements Interactor<UserFcmInput, VoidResponse> {
	#localization: Localization
	#users: UserCollection

	public constructor(localization: Localization, users: UserCollection) {
		this.#localization = localization
		this.#users = users
	}

	public async execute(body: UserFcmInput, { identity }: RequestContext): Promise<VoidResponse> {
		if (!body?.fcmToken) {
			return new FailedResponse(
				this.#localization.t('mutation.updateUserFCMToken.userFCMTokenFailed')
			)
		}

		// TODO: tokenize and expire fcm tokens
		try {
			await this.#users.updateItem(
				{ id: identity?.id },
				{
					$set: {
						fcm_token: body.fcmToken
					}
				}
			)
		} catch (error) {
			logger('error updating token', error)
			return new FailedResponse(
				this.#localization.t('mutation.updateUserFCMToken.userFCMTokenFailed')
			)
		}

		return new SuccessVoidResponse(this.#localization.t('mutation.updateUserFCMToken.success'))
	}
}
