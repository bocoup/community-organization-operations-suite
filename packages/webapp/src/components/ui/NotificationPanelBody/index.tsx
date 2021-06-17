/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Engagement, Mention } from '@greenlight/schema/lib/client-types'
import NotificationRow from '~ui/NotificationRow'
import { useAuthUser } from '~hooks/api/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface NotificationPanelBodyProps extends ComponentProps {
	request?: Engagement
	onClose?: () => void
}

export default function NotificationPanelBody({
	request,
	onClose
}: NotificationPanelBodyProps): JSX.Element {
	// const timeRemaining = request.endDate - today
	const { authUser, currentUserId, markMention } = useAuthUser()
	const router = useRouter()

	const [newMentions, setNewMentions] = useState<Mention[]>([])

	useEffect(() => {
		const tempMentions = authUser.user.mentions?.filter(m => !m.seen)
		setNewMentions(tempMentions)
	}, [authUser])

	const showAllMentions = () => {
		setNewMentions(authUser.user.mentions)
	}

	const handleNotificationSelect = async (engagementId, seen) => {
		if (!seen) {
			await markMention(currentUserId, engagementId)
		}
		router.push(`${router.pathname}?engagement=${engagementId}`)
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Notifications</h3>

			{newMentions.length !== 0 &&
				newMentions.map((m, i) => (
					<NotificationRow
						key={`${m.engagementId}-${i}`}
						clickCallback={() => handleNotificationSelect(m.engagementId, m.seen)}
						mention={m}
					/>
				))}

			{!newMentions.length && (
				<div className={styles.noMentions}>
					You have no new notifications.{' '}
					<span onClick={showAllMentions}>Click here to view all.</span>
				</div>
			)}
		</div>
	)
}
