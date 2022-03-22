/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { useState, useCallback } from 'react'
import styles from './index.module.scss'
import { Row, Col } from 'react-bootstrap'
import cx from 'classnames'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useAuthUser } from '~hooks/api/useAuth'
import { PasswordResetRequestForm } from '../PasswordResetRequestForm'
import { ChangePasswordForm } from '../ChangePasswordForm'
import { wrap } from '~utils/appinsights'
import { StatusType } from '~hooks/api'

export const PasswordResetForm: FC<{
	resetToken?: string
}> = wrap(function PasswordResetForm({ resetToken }) {
	const { t } = useTranslation(Namespace.PasswordReset)
	const { initiatePasswordReset, executePasswordReset } = useAuthUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const [complete, setComplete] = useState(false)
	const handleExecutePasswordResetClick = useCallback(
		async (values) => {
			const response = await executePasswordReset(resetToken, values.newPassword)
			const isSuccess = response.status === StatusType.Success
			setSubmitMessage(isSuccess ? null : response.message)
			setComplete(isSuccess)
		},
		[executePasswordReset, resetToken]
	)

	const handleInitiatePasswordResetClick = useCallback(
		async (values) => {
			const response = await initiatePasswordReset(values.email)
			const isSuccess = response.status === StatusType.Success
			setSubmitMessage(isSuccess ? null : response.message)
			setComplete(isSuccess)
		},
		[initiatePasswordReset]
	)

	return (
		<Row className='align-items-center'>
			<Col sm={12} md={6} className={styles.header}>
				<h1 className='mb-5'>{t('header')}</h1>
				<p className={styles.subHeader}>{t('subHeader')}</p>
			</Col>
			<Col className={cx('shadow', styles.resetForm)}>
				{resetToken ? (
					<ChangePasswordForm
						changePasswordClick={handleExecutePasswordResetClick}
						submitMessage={submitMessage}
						complete={complete}
					/>
				) : (
					<PasswordResetRequestForm
						submitMessage={submitMessage}
						passwordResetClick={handleInitiatePasswordResetClick}
						complete={complete}
					/>
				)}
			</Col>
		</Row>
	)
})
