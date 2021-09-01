/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatusType, UserFcmInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'

export class UpdateUserFCMTokenInteractor implements Interactor<UserFcmInput, VoidResponse> {
	#localization: Localization
	#users: UserCollection

	public constructor(localization: Localization, users: UserCollection) {
		this.#localization = localization
		this.#users = users
	}

	public async execute(body: UserFcmInput, { identity }: RequestContext): Promise<VoidResponse> {
		if (!body?.fcmToken)
			return {
				message: this.#localization.t('mutation.updateUserFCMToken.userFCMTokenFailed'),
				status: StatusType.Failed
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
			console.error('error updating token', error)
			return {
				message: this.#localization.t('mutation.updateUserFCMToken.userFCMTokenFailed'),
				status: StatusType.Failed
			}
		}

		return {
			message: this.#localization.t('mutation.updateUserFCMToken.success'),
			status: StatusType.Success
		}
	}
}
