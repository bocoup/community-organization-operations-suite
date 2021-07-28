/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import NotificationRow from '~ui/NotificationRow'
import { useRouter } from 'next/router'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

const NotificationPanelBody = memo(function NotificationPanelBody(): JSX.Element {
	const { c } = useTranslation()
	const { currentUser, markMention } = useCurrentUser()
	const metions = currentUser?.mentions
	const router = useRouter()

	const handleNotificationSelect = async (engagementId, seen) => {
		if (!seen) {
			await markMention(currentUser?.id, engagementId)
		}
		router.push(`${router.pathname}?engagement=${engagementId}`, undefined, { shallow: true })
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>{c('notification.title')}</h3>

			{(!metions || metions.length === 0) && (
				<div className={styles.noMentions}>{c('noNotification.text')}</div>
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
