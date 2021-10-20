/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateUserFcmTokenArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'
const logger = createLogger('interactors:update-user-fcm-token')

export class UpdateUserFCMTokenInteractor
	implements Interactor<MutationUpdateUserFcmTokenArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly users: UserCollection
	) {}

	public async execute(
		{ fcmToken }: MutationUpdateUserFcmTokenArgs,
		{ identity }: RequestContext
	): Promise<VoidResponse> {
		// TODO: tokenize and expire fcm tokens
		try {
			await this.users.updateItem(
				{ id: identity?.id },
				{
					$set: {
						fcm_token: fcmToken
					}
				}
			)
		} catch (error) {
			logger('error updating token', error)
			return new FailedResponse(
				this.localization.t('mutation.updateUserFCMToken.userFCMTokenFailed')
			)
		}

		return new SuccessVoidResponse(this.localization.t('mutation.updateUserFCMToken.success'))
	}
}
