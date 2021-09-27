/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import 'firebase/messaging'
import firebase from 'firebase/app'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useCallback, useMemo, useState } from 'react'
import devLog from '~utils/devLog'
import config from '~utils/config'
import { getStatic } from '~utils/getStatic'

// Firebase configuration
function getFirebaseConfig() {
	return {
		...config.firebase,
		fcmVapidServerKey: undefined
	}
}
function getFirebaseFcmVapidKey(): string {
	const key = config.firebase.fcmVapidServerKey
	return key
}

export interface usePushNotificationsReturns {
	initialize: () => Promise<void>
	enabled: boolean
}

/**
 * Initialize service worker and register firebase
 */
function usePushNotifications(): usePushNotificationsReturns {
	const [enabled, setEnabled] = useState(false)
	const { updateFCMToken } = useCurrentUser()

	/**
	 * Intializes firebase sdk
	 *
	 * @returns a fcm token or nul
	 */
	const initializeFirebase = useCallback(async () => {
		if (!firebase.apps.length) {
			firebase.initializeApp(getFirebaseConfig())

			try {
				const messaging = firebase.messaging()
				const tokenInLocalStorage = localStorage.getItem('fcm_token')

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
				setEnabled(permissionGranted)

				if (permissionGranted) {
					// If FCM token is already there just return the token
					if (tokenInLocalStorage !== null) {
						return tokenInLocalStorage
					}

					// Get token from FCM
					const fcm_token = await messaging.getToken({ vapidKey: getFirebaseFcmVapidKey() })

					if (fcm_token) {
						// Set FCM token in local storage
						localStorage.setItem('fcm_token', fcm_token)

						devLog('fcm token', fcm_token)

						// Return the FCM token after saving it
						return fcm_token
					} else {
						console.log('no fcm token found')
					}
				}
			} catch (error) {
				console.error(error)
				return null
			}
		}
	}, [setEnabled])

	const initialize = useCallback(async () => {
		try {
			// Register service worker
			registerServiceWorker()

			// Register fcm
			const fcmToken = await initializeFirebase()
			if (fcmToken) updateFCMToken(fcmToken)
		} catch (error) {
			console.log('error', error)
		}
	}, [updateFCMToken, initializeFirebase])

	return useMemo(
		() => ({
			initialize,
			enabled
		}),
		[initialize, enabled]
	)
}

// Registers the service worker
async function registerServiceWorker(): Promise<void> {
	// Register the service worker
	if ('serviceWorker' in navigator && typeof window !== 'undefined') {
		window.addEventListener('load', async () => {
			try {
				console.log('registering firebase service worker')
				await navigator.serviceWorker.register(getStatic(`/firebase-messaging.sw.js`))
			} catch (err) {
				console.log('Service Worker registration failed: ', err)
			}
		})
	} else {
		console.log('Service workers are not supported by this browser')
	}
}

export default usePushNotifications
