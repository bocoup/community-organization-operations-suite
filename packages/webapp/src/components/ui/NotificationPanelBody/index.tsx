/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import NotificationRow from '~ui/NotificationRow'
import { useRouter } from 'next/router'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { memo } from 'react'

const NotificationPanelBody = memo(function NotificationPanelBody(): JSX.Element {
	const { currentUser, markMention } = useCurrentUser()
	const metions = currentUser?.mentions
	const router = useRouter()

	const handleNotificationSelect = async (engagementId, seen) => {
		if (!seen) {
			await markMention(currentUser?.id, engagementId)
		}
		router.push(`${router.pathname}?engagement=${engagementId}`)
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Notifications</h3>

			{(!metions || metions.length === 0) && (
				<div className={styles.noMentions}>You have no notifications. </div>
			)}

			{metions?.map((m, i) => (
				<NotificationRow
					key={`${m.engagementId}-${i}`}
					clickCallback={() => handleNotificationSelect(m.engagementId, m.seen)}
					mention={m}
				/>
			))}
		</div>
	)
})
export default NotificationPanelBody
