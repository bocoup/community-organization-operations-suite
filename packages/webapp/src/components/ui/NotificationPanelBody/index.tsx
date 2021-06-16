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

interface NotificationPanelBodyProps extends ComponentProps {
	request?: Engagement
	onClose?: () => void
}

export default function NotificationPanelBody({
	request,
	onClose
}: NotificationPanelBodyProps): JSX.Element {
	// const timeRemaining = request.endDate - today

	const handleEngagementSelect = async engagementId => {
		// await completeEngagement()
		onClose?.()
	}

	return (
		<div className={styles.bodyWrapper}>
			<h3>Nofications</h3>

			{/* Notification list goes here */}
		</div>
	)
}
