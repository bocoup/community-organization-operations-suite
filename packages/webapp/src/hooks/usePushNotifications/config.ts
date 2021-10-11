/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { config } from '~utils/config'

// Firebase configuration
export function getFirebaseConfig() {
	return {
		...config.firebase,
		fcmVapidServerKey: undefined
	}
}
export function getFirebaseFcmVapidKey(): string {
	const key = config.firebase.fcmVapidServerKey
	return key
}
