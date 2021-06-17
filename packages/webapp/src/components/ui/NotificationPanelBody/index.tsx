/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Engagement, Mention } from '@greenlight/schema/lib/client-types'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { PrimaryButton, DefaultButton } from '@fluentui/react'
import RequestHeader from '~ui/RequestHeader'
import ShortString from '~ui/ShortString'
import HappySubmitButton from '~ui/HappySubmitButton'
import SpecialistSelect from '~ui/SpecialistSelect'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import RequestActionHistory from '~lists/RequestActionHistory'
import RequestActionForm from '~forms/RequestActionForm'
import RequestAssignment from '~ui/RequestAssignment'
import NotificationRow from '~ui/NotificationRow'
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagement } from '~hooks/api/useEngagement'
import { Formik, Form } from 'formik'
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
			const resp = await markMention(currentUserId, engagementId)
		}
		router.push(`${router.pathname}?engagement=${engagementId}`)
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Notifications</h3>

			{newMentions.length !== 0 &&
				newMentions.map(m => (
					<NotificationRow
						key={m.engagementId}
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
