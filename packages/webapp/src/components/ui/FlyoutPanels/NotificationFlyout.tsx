/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { NotificationPanel } from '~components/ui/NotificationsPanel'
import { useFlyoutDismisser } from './hooks'
import type { FlyoutProps } from './types'

export const NotificationFlyout: FC<FlyoutProps> = memo(function NotificationFlyout({
	isOpen,
	setIsOpen
}) {
	const handleDismiss = useFlyoutDismisser('notifications', setIsOpen)
	return <NotificationPanel openPanel={isOpen} onDismiss={handleDismiss} />
})
