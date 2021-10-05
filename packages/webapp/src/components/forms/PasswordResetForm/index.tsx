/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import { Row, Col } from 'react-bootstrap'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import { useAuthUser } from '~hooks/api/useAuth'
import PasswordResetRequestForm from '../PasswordResetRequestForm'
import ChangePasswordForm from '../ChangePasswordForm'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { StatusType } from '@cbosuite/schema/dist/client-types'

export const PasswordResetForm = wrap(
	memo(function PasswordResetForm(): JSX.Element {
		const { t } = useTranslation('passwordReset')
		const history = useHistory()
		const { resetToken, email } = useLocationQuery()
		const { forgotPassword, validateResetPassword, changePassword } = useAuthUser()
		const [submitMessage, setSubmitMessage] = useState<string | null>(null)
		const [isResetValid, setResetValid] = useState<boolean>(false)
		const [isRouterQueryValidated, setRouterQueryValidated] = useState<boolean>(false)

		const validateResetToken = useCallback(
			async (email: string, resetToken: string) => {
				const response = await validateResetPassword(email, resetToken)

				if (response.status === StatusType.Success) {
					setResetValid(true)
				} else {
					setResetValid(false)
					setSubmitMessage(response?.message)
				}

				setRouterQueryValidated(true)
			},
			[validateResetPassword, setResetValid, setRouterQueryValidated]
		)

		useEffect(() => {
			if (!isRouterQueryValidated && typeof resetToken === 'string' && typeof email === 'string') {
				validateResetToken(email, resetToken)
			}
		}, [email, resetToken, validateResetToken, isRouterQueryValidated])

		const handlePasswordResetClick = async (values) => {
			const response = await forgotPassword(values.email)
			if (response.status === StatusType.Success) {
				setSubmitMessage(null)
			} else {
				setSubmitMessage(response.message)
			}
		}

		const handleChangePasswordClick = async (newPassword) => {
			const response = await changePassword(email as string, newPassword)
			if (response.status === StatusType.Success) {
				setSubmitMessage(null)
			} else {
				setSubmitMessage(response?.message)
			}
		}

		const handleGoBackClick = () => {
			history.push('/login')
		}

		return (
			<Row className='align-items-center'>
				<Col sm={12} md={6} className={styles.header}>
					<h1 className='mb-5'>{t('header')}</h1>
					<p className={styles.subHeader}>{t('subHeader')}</p>
				</Col>
				<Col className={cx('shadow', styles.resetForm)}>
					{isResetValid ? (
						<ChangePasswordForm
							changePasswordClick={handleChangePasswordClick}
							submitMessage={submitMessage}
							goBackToLoginClick={handleGoBackClick}
						/>
					) : (
						<PasswordResetRequestForm
							submitMessage={submitMessage}
							passwordResetClick={handlePasswordResetClick}
							goBackToLoginClick={handleGoBackClick}
						/>
					)}
				</Col>
			</Row>
		)
	})
)
