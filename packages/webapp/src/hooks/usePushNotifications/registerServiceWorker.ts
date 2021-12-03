/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { getStatic } from '~utils/getStatic'
import { createLogger } from '~utils/createLogger'

const logger = createLogger('usePushNotifications')

export async function registerServiceWorker(): Promise<void> {
	// Register the service worker
	if ('serviceWorker' in navigator && typeof window !== 'undefined') {
		window.addEventListener('load', async () => {
			try {
				logger('registering firebase service worker')
				await navigator.serviceWorker.register(getStatic(`/firebase-messaging.sw.js`))
			} catch (err) {
				logger('Service Worker registration failed: ', err)
			}
		})
	} else {
		logger('Service workers are not supported by this browser')
	}
}
