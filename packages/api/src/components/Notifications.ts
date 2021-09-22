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

export class Notifications {
	#config: Configuration
	#fbAdmin: fbApp.App | null

	public constructor(config: Configuration) {
		this.#config = config
		const isEnabled = Boolean(config.firebaseCredentials?.private_key)
		this.#fbAdmin = isEnabled
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
		if (this.#fbAdmin) {
			const sendResult = await this.#fbAdmin!.messaging().sendToDevice(messageOptions.token, {
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
		fcmToken: string
	): Promise<fbMessaging.MessagingDevicesResponse | null> {
		if (this.#fbAdmin) {
			const sendResult = await this.sendMessage({
				token: fcmToken,
				notification: {
					title: 'A client needs your help!',
					body: 'Go to the dashboard to view this request'
				}
			})

			return sendResult
		} else {
			return null
		}
	}
}
