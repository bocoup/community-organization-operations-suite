/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styles from './index.module.scss'
import React, { useState, useEffect, memo, useCallback } from 'react'
import cx from 'classnames'
import { Badge } from '~ui/Badge'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { get } from 'lodash'

export const Notifications = memo(function Notifications() {
	const [, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { currentUser } = useCurrentUser()
	const mentions = get(currentUser, 'mentions')
	const [newMentionsCount, setNewMentionsCount] = useState(
		mentions?.filter((m) => !m.seen)?.length || 0
	)

	useEffect(() => {
		if (mentions) {
			setNewMentionsCount(mentions.filter((m) => !m.seen).length)
		}
	}, [mentions])
	const openNotifications = useCallback(
		(evt: React.MouseEvent) => {
			evt.stopPropagation()
			evt.preventDefault()
			setNotificationsOpen(true)
		},
		[setNotificationsOpen]
	)
	return (
		<div id='notifications-bell' className={cx(styles.notifications)} onClick={openNotifications}>
			<Badge count={newMentionsCount} />
			<FontIcon className='me-3' iconName='Ringer' />
		</div>
	)
})
