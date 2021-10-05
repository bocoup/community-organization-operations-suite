/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { NotificationRow } from '~ui/NotificationRow'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export const NotificationPanelBody = memo(function NotificationPanelBody(): JSX.Element {
	const history = useHistory()
	const { c } = useTranslation()
	const { currentUser, markMention, dismissMention } = useCurrentUser()
	const mentions = currentUser?.mentions

	const handleNotificationSelect = async (engagementId, seen, createdAt, markAllAsRead) => {
		if (markAllAsRead) {
			await markMention(currentUser?.id, engagementId, createdAt, markAllAsRead)
		} else {
			if (!seen) {
				await markMention(currentUser?.id, engagementId, createdAt, markAllAsRead)
			}
			history.push(`${history.location.pathname}?engagement=${engagementId}`)
		}
	}

	const handleNotificationDismiss = async (engagementId, dismissed, createdAt, dismissAll) => {
		if (dismissAll) {
			await dismissMention(currentUser?.id, engagementId, createdAt, dismissAll)
		} else {
			if (!dismissed) {
				await dismissMention(currentUser?.id, engagementId, createdAt, dismissAll)
			}
		}
	}

	return (
		<div className={styles.bodyWrapper}>
			<div className={styles.notificationHeader}>
				<h3>{c('notificationTitle')}</h3>

				{!mentions || mentions.length === 0 ? (
					<div className={styles.noMentions}>{c('noNotificationText')}</div>
				) : (
					<Col className='mt-3'>
						<Row>
							<Col></Col>
							<Col md={3}>
								<button
									tabIndex={0}
									className={styles.markAllRead}
									onClick={() =>
										handleNotificationSelect(
											mentions[0].engagement.id,
											mentions[0].seen,
											mentions[0].createdAt,
											true
										)
									}
								>
									{c('notificationButtons.markAllAsReadText')}
								</button>
							</Col>
							<Col md={2}>
								<button
									className={styles.dismissAll}
									onClick={() =>
										handleNotificationDismiss(
											mentions[0].engagement.id,
											mentions[0].dismissed,
											mentions[0].createdAt,
											true
										)
									}
								>
									{c('notificationButtons.dismissAllText')}
								</button>
							</Col>
						</Row>
					</Col>
				)}
			</div>

			{mentions?.map((m, i) => (
				<NotificationRow
					key={`${m.engagement.id}-${i}`}
					clickCallback={() =>
						handleNotificationSelect(m.engagement.id, m.seen, m.createdAt, false)
					}
					dismissCallback={() =>
						handleNotificationDismiss(m.engagement.id, m.dismissed, m.createdAt, false)
					}
					mention={m}
				/>
			))}
		</div>
	)
})
