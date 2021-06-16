/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
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
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagement } from '~hooks/api/useEngagement'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'

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

	const handleNotificationSelect = async engagementId => {
		// // call to the backend to mark as seen
		// onClose?.()
		// // call router
		const resp = await markMention(currentUserId, engagementId)
		console.log('next level resp', resp)
		//router.push(`${router.pathname}?engagement=${engagementId}`)
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Notifications</h3>

			{authUser.user.mentions?.map(m => (
				<div key={m.engagementId} onClick={() => handleNotificationSelect(m.engagementId)}>
					{' '}
					You were mentioned on an request action. Click here to view.
				</div>
			))}
		</div>
	)
}
