/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { MessageBar } from '@fluentui/react'
import useInAppNotifications from '~hooks/useInAppNotificaitons'
import type InAppNotification from '~types/InAppNotification'

const InAppNotifications = memo(function InAppNotifications(): JSX.Element {
	const { notifications } = useInAppNotifications()

	return (
		<>
			{notifications.map((notification: InAppNotification, i: number) => (
				<MessageBar key={i}>{notification.message}</MessageBar>
			))}
		</>
	)
})
export default InAppNotifications
