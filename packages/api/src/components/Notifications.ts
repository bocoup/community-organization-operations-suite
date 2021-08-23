/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from './Configuration'
import * as admin from 'firebase-admin'
import serviceAccount from '../../config/firebase-admin-sdk.json'

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
	#config: Configuration | undefined
	#fbAdmin: admin.app.App

	public constructor(config?: Configuration) {
		this.#config = config
		this.#fbAdmin = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
		})
	}

	/**
	 * Sends a notification to a specific user
	 * @param messageOptions
	 */
	public async sendMessage(
		messageOptions: MessageOptions
	): Promise<admin.messaging.MessagingDevicesResponse> {
		const sendResult = await this.#fbAdmin.messaging().sendToDevice(messageOptions.token, {
			notification: messageOptions.notification
		} as admin.messaging.MessagingPayload)

		return sendResult
	}

	/**
	 * Send a notification related to being assigned a request by a user
	 */
	public async assignedRequest(
		fcmToken: string
	): Promise<admin.messaging.MessagingDevicesResponse> {
		const sendResult = await this.sendMessage({
			token: fcmToken,
			notification: {
				title: 'A client needs your help!',
				body: 'Go to the dashboard to view this request'
			}
		})

		return sendResult
	}
}
