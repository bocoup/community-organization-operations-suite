/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import 'firebase/messaging'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useCallback, useMemo, useState } from 'react'
import { config } from '~utils/config'
import { createLogger } from '~utils/createLogger'
import { initializeFirebase } from './initializeFirebase'
import { registerServiceWorker } from './registerServiceWorker'

const logger = createLogger('usePushNotifications')

export interface usePushNotificationsReturns {
	initialize: () => Promise<void>
	enabled: boolean
}

/**
 * Initialize service worker and register firebase
 */
export function usePushNotifications(): usePushNotificationsReturns {
	const [enabled, setEnabled] = useState(false)
	const { updateFCMToken } = useCurrentUser()

	const initialize = useCallback(async () => {
		if (config.features.inAppNotifications.enabled) {
			try {
				// Register service worker
				registerServiceWorker()

				// Register fcm
				const fcmToken = await initializeFirebase()
				if (fcmToken) updateFCMToken(fcmToken)
				if (fcmToken) setEnabled(true)
			} catch (error) {
				logger('error', error)
			}
		}
	}, [updateFCMToken, setEnabled])

	return useMemo(
		() => ({
			initialize,
			enabled
		}),
		[initialize, enabled]
	)
}
