/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import firebase from 'firebase/app'
import { devLog } from '~utils/devLog'
import { createLogger } from '~utils/createLogger'
import { getFirebaseConfig, getFirebaseFcmVapidKey } from './config'
import { retrieveFcmToken, storeFcmToken } from '~utils/localStorage'

const logger = createLogger('usePushNotifications')

/**
 * Intializes firebase sdk
 *
 * @returns a fcm token or nul
 */
export async function initializeFirebase(): Promise<string | null> {
	if (!firebase.apps.length) {
		firebase.initializeApp(getFirebaseConfig())

		try {
			const messaging = firebase.messaging()
			const tokenInLocalStorage = retrieveFcmToken()

			// Handle incoming messages. Called when:
			// - a message is received while the app has focus
			// - the user clicks on an app notification created by a service worker
			//   `messaging.onBackgroundMessage` handler.
			messaging.onMessage((payload) => {
				devLog('Message received. ', payload)
			})

			// Requesting notification permission from browser
			// This is skipped if the user has already granted permission
			const status = await Notification.requestPermission()
			const permissionGranted = status && status === 'granted'

			if (permissionGranted) {
				// If FCM token is already there just return the token
				if (tokenInLocalStorage !== null) {
					return tokenInLocalStorage
				}

				// Get token from FCM
				const fcm_token = await messaging.getToken({ vapidKey: getFirebaseFcmVapidKey() })

				if (fcm_token) {
					// Set FCM token in local storage
					storeFcmToken(fcm_token)

					devLog('fcm token', fcm_token)

					// Return the FCM token after saving it
					return fcm_token
				} else {
					logger('no fcm token found')
				}
			}
		} catch (error) {
			logger(`error`, error)
			return null
		}
	}
}
