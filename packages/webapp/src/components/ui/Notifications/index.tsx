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

import ClientOnly from '~ui/ClientOnly'
import { useCurrentUser } from '~hooks/api/useCurrentuser'

interface NotificationsProps extends ComponentProps {
	mentions?: any[]
}

export default function Notifications({ mentions }: NotificationsProps): JSX.Element {
	const [, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { currentUser } = useCurrentUser()
	const [newMentionsCount, setNewMentionsCount] = useState(0)

	useEffect(() => {
		if (currentUser?.mentions) {
			setNewMentionsCount(currentUser.mentions.filter(m => !m.seen).length || 0)
		}
	}, [currentUser])

	return (
		<ClientOnly>
			<div className={cx(styles.notifications)} onClick={() => setNotificationsOpen(true)}>
				<Badge count={newMentionsCount} />
				<FontIcon className='me-3' iconName='Ringer' />
			</div>
		</ClientOnly>
	)
}
