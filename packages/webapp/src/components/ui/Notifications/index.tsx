/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import styles from './index.module.scss'
import { useState, useEffect, memo, useMemo } from 'react'
import cx from 'classnames'
import { Badge } from '~ui/Badge'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { get } from 'lodash'
import { useNavCallback } from '~hooks/useNavCallback'
import { useLocationQuery } from '~hooks/useLocationQuery'

export const Notifications = memo(function Notifications() {
	const mentionCount = useMentionCount()
	const toggleNotifications = useToggleNotifications()
	return (
		<div id='notifications-bell' className={cx(styles.notifications)} onClick={toggleNotifications}>
			<Badge count={mentionCount} />
			<FontIcon className='me-3' iconName='Ringer' />
		</div>
	)
})

function useToggleNotifications() {
	const { notifications } = useLocationQuery()
	const isShown = useMemo(() => Boolean(notifications), [notifications])
	return useNavCallback(null, { notifications: isShown ? undefined : true })
}

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
