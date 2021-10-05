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
	const [, setIsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const mentionCount = useMentionCount()
	const openNotifications = useCallback(() => setIsOpen(true), [setIsOpen])
	return (
		<div id='notifications-bell' className={cx(styles.notifications)} onClick={openNotifications}>
			<Badge count={mentionCount} />
			<FontIcon className='me-3' iconName='Ringer' />
		</div>
	)
})

function useMentionCount(): number {
	const { currentUser } = useCurrentUser()
	const mentions = get(currentUser, 'mentions')
	const [newCount, setNewCount] = useState(mentions?.filter((m) => !m.seen)?.length || 0)

	useEffect(
		function updateNewMentionCountWhenMentionsChange() {
			if (mentions) {
				setNewCount(mentions.filter((m) => !m.seen).length)
			}
		},
		[mentions]
	)
	return newCount
}
