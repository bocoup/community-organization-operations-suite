/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styles from './index.module.scss'
import { useState, useEffect } from 'react'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import Badge from '~ui/Badge'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'

import { useAuthUser } from '~hooks/api/useAuth'

interface NotificationsProps extends ComponentProps {
	mentions?: any[]
}

export default function Notifications({ mentions }: NotificationsProps): JSX.Element {
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { authUser } = useAuthUser()
	const [newMentionsCount, setNewMentionsCount] = useState(0)

	useEffect(() => {
		if (authUser) {
			setNewMentionsCount(authUser.user.mentions?.filter(m => !m.seen).length)
		}
	}, [authUser])

	return (
		<div className={cx(styles.notifications)} onClick={() => setNotificationsOpen(true)}>
			<Badge count={newMentionsCount} />
			<FontIcon className='me-3' iconName='Ringer' />
		</div>
	)
}
