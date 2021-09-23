/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import getStatic from '~utils/getStatic'
import 'firebase/messaging'
import firebase from 'firebase/app'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useState } from 'react'
import devLog from '~utils/devLog'

// Firebase configuration
const firebaseConfig: Record<string, any> = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID
}
const firebaseFcmVapidKey = process.env.FIREBASE_VAPID_SERVER_KEY

export interface usePushNotificationsReturns {
	initialize: () => void
	enabled: boolean
}

/**
 * Initialize service worker and register firebase
 */
const usePushNotifications = (): usePushNotificationsReturns => {
	const [enabled, setEnabled] = useState(false)
	const { updateFCMToken } = useCurrentUser()

	const initialize: usePushNotificationsReturns['initialize'] = async () => {
		try {
			// Register service worker
			registerServiceWorker()

			// Register fcm
			const fcmToken = await intializeFirebase()
			if (fcmToken) updateFCMToken(fcmToken)
		} catch (error) {
			console.log('error', error)
		}
	}

	/**
	 * Intializes firebase sdk
	 *
	 * @returns a fcm token or nul
	 */
	async function intializeFirebase(): Promise<string | null> {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig)

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
					const fcm_token = await messaging.getToken({ vapidKey: firebaseFcmVapidKey })

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
	}

	// Registers the service worker
	async function registerServiceWorker(): Promise<void> {
		// Register the service worker
		if ('serviceWorker' in navigator && typeof window !== 'undefined') {
			window.addEventListener('load', async () => {
				try {
					await navigator.serviceWorker.register(getStatic('/firebase-messaging-sw.js'))
				} catch (err) {
					console.log('Service Worker registration failed: ', err)
				}
			})
		} else {
			console.log('Service workers are not supported by this browser')
		}
	}

	return {
		initialize,
		enabled
	}
}

export default usePushNotifications
