/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from './Configuration'
import * as admin from 'firebase-admin'
import serviceAccount from '../../config/firebase-admin-sdk.json'

export interface MessageOptions {
	message: string
	title: string
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

	public async sendMessage(messageOptions: MessageOptions): Promise<void> {
		console.log(messageOptions)
	}
}
