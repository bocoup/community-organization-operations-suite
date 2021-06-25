/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { debounce } from 'lodash'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { inAppNotificationsState } from '~store'
import InAppNotification from '~types/InAppNotification'

interface useInAppNotificationsReturn {
	push: (notification: InAppNotification) => void
	notifications: InAppNotification[]
}

/**
 * Hook for managing in app Notifications
 * @returns {WindowSize} WindowSize with width, height, and breakpoints
 */
export default function useInAppNotifications(): useInAppNotificationsReturn {
	const [notifications, setNotifications] =
		useRecoilState<InAppNotification[]>(inAppNotificationsState)

	useEffect(() => {
		// let interval = null

		if (notifications.length > 0) {
			console.log('notifications', notifications)

			// interval = setInterval(() => {
			// 	// Stop if length becomes 0
			// 	if (notifications.length === 0) clearInterval(interval)

			// 	// pop on notification from front of list
			// 	const _notifications = [...notifications]
			// 	_notifications.shift()
			// 	setNotifications(_notifications)
			// }, 1500)
		}
		return () => clearInterval(interval)
	}, [notifications, setNotifications])

	const push = (notification: InAppNotification) => {
		setNotifications([...notifications, notification])
	}

	return {
		push,
		notifications
	}
}
