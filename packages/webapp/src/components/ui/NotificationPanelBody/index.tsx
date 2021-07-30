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
import { Col, Row } from 'react-bootstrap'

const NotificationPanelBody = memo(function NotificationPanelBody(): JSX.Element {
	const { c } = useTranslation()
	const { currentUser, markMention } = useCurrentUser()
	const mentions = currentUser?.mentions
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

			{!mentions || mentions.length === 0 ? (
				<div className={styles.noMentions}>{c('noNotification.text')}</div>
			) : (
				<Col className='mt-3'>
					<Row>
						<Col></Col>
						<Col md={3}>Mark all as read</Col>
						<Col md={2}>Dismiss all</Col>
					</Row>
				</Col>
			)}

			{mentions?.map((m, i) => (
				<NotificationRow
					key={`${m.engagement.id}-${i}`}
					clickCallback={() => handleNotificationSelect(m.engagement.id, m.seen)}
					mention={m}
				/>
			))}
		</div>
	)
})
export default NotificationPanelBody
