/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import NotificationRow from '~ui/NotificationRow'
import { useAuthUser } from '~hooks/api/useAuth'
import { useRouter } from 'next/router'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { memo } from 'react'

interface NotificationPanelBodyProps extends ComponentProps {
	onClose?: () => void
}

const NotificationPanelBody = memo(function NotificationPanelBody({
	onClose
}: NotificationPanelBodyProps): JSX.Element {
	const { markMention } = useAuthUser()
	const { currentUser } = useCurrentUser()

	const router = useRouter()

	const handleNotificationSelect = async (engagementId, seen) => {
		if (!seen) {
			await markMention(currentUser.id, engagementId)
		}
		router.push(`${router.pathname}?engagement=${engagementId}`)
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Notifications</h3>

			{(!currentUser?.mentions || currentUser?.mentions.length === 0) && (
				<div className={styles.noMentions}>You have no notifications. </div>
			)}

			{currentUser?.mentions?.map((m, i) => (
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
