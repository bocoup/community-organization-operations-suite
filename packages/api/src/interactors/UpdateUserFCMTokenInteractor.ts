/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatusType, UserFcmInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { DbUser, UserCollection } from '~db'
import { Interactor } from '~types'

export class UpdateUserFCMTokenInteractor implements Interactor<UserFcmInput, VoidResponse> {
	#localization: Localization
	#users: UserCollection

	public constructor(localization: Localization, users: UserCollection) {
		this.#localization = localization
		this.#users = users
	}

	public async execute(body: UserFcmInput, identity?: DbUser | null): Promise<VoidResponse> {
		if (!body.fcmToken)
			return {
				message: this.#localization.t('mutation.updateUser.failed'),
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
			if (!body.fcmToken)
				return {
					message: this.#localization.t('mutation.updateUser.failed'),
					status: StatusType.Failed
				}
		}

		return {
			message: this.#localization.t('mutation.updateUser.success'),
			status: StatusType.Success
		}
	}
}
