/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from './Configuration'
import {
	initializeApp as fbInitializeApp,
	credential as fbCredential,
	ServiceAccount as FBServiceAccount,
	messaging as fbMessaging,
	app as fbApp
} from 'firebase-admin'
import { Localization } from './Localization'
import { singleton } from 'tsyringe'

export interface MessageOptions {
	token: string
	notification: NotificationOptions
}
export interface NotificationOptions {
	title: string
	body: string
	color?: string
	icon?: string
}

@singleton()
export class Notifications {
	private readonly fbAdmin: fbApp.App | null

	public constructor(config: Configuration, private readonly localization: Localization) {
		const isEnabled = Boolean(config.firebaseCredentials?.private_key)
		this.fbAdmin = isEnabled
			? fbInitializeApp({
					credential: fbCredential.cert(config.firebaseCredentials as FBServiceAccount)
			  })
			: null
	}

	/**
	 * Sends a notification to a specific user
	 * @param messageOptions
	 */
	public async sendMessage(
		messageOptions: MessageOptions
	): Promise<fbMessaging.MessagingDevicesResponse | null> {
		if (this.fbAdmin) {
			const sendResult = await this.fbAdmin!.messaging().sendToDevice(messageOptions.token, {
				notification: messageOptions.notification
			} as fbMessaging.MessagingPayload)

			return sendResult
		} else {
			return null
		}
	}

	/**
	 * Send a notification related to being assigned a request by a user
	 */
	public async assignedRequest(
		fcmToken: string,
		locale: string
	): Promise<fbMessaging.MessagingDevicesResponse | null> {
		if (this.fbAdmin) {
			const sendResult = await this.sendMessage({
				token: fcmToken,
				notification: {
					title: this.localization.t('mutation.notifier.assignedRequestTitle', locale),
					body: this.localization.t('mutation.notifier.assignedRequestBody', locale)
				}
			})

			return sendResult
		} else {
			return null
		}
	}
}
