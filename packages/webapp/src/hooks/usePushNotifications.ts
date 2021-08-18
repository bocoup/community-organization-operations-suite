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

// TODO: move this to config
// Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBB7kZZvJXQrWSeqFJQn-ZEGeAuAF5l3c0',
	authDomain: 'project-resolve-test.firebaseapp.com',
	projectId: 'project-resolve-test',
	storageBucket: 'project-resolve-test.appspot.com',
	messagingSenderId: '894244672689',
	appId: '1:894244672689:web:40d88d5b7494dc55ab3e90'
}

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
				messaging.onMessage(payload => {
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
					const fcm_token = await messaging.getToken({
						vapidKey:
							'BJXSS0i43upmzQfNPNaq3KQMVkFstTXw0t_ywfA0OTFoXc3KjML0a8KOqEDDSRqsEIOpwXa1sN7HffI9cxyUp6k'
					})

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
					await navigator.serviceWorker.register(getStatic('firebase-messaging-sw.js'))
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
