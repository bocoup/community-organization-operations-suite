/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import NotificationRow from '~ui/NotificationRow'
import { useRouter } from 'next/router'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { memo } from 'react'
import { useTranslation } from 'next-i18next'

const NotificationPanelBody = memo(function NotificationPanelBody(): JSX.Element {
	const { t } = useTranslation('common')
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
			<h3>{t('notification.title')}</h3>

			{(!metions || metions.length === 0) && (
				<div className={styles.noMentions}>{t('noNotification.text')}</div>
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
