/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import { Row, Col, Container } from 'react-bootstrap'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import { useRouter } from 'next/router'
import { useAuthUser } from '~hooks/api/useAuth'
import PasswordResetRequestForm from '../PasswordResetRequestForm'
import ChangePasswordForm from '../ChangePasswordForm'

const PasswordResetForm = memo(function PasswordResetForm(): JSX.Element {
	const { t } = useTranslation('passwordReset')
	const router = useRouter()
	const { resetToken, email } = router.query
	const { forgotPassword, validateResetPassword } = useAuthUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const [isResetValid, setResetValid] = useState<boolean>(false)

	const validateResetToken = useCallback(
		async (email: string, resetToken: string) => {
			const response = await validateResetPassword(email, resetToken)
			console.log('in callback ------', response)

			if (response.status === 'success') {
				setResetValid(true)
			}
		},
		[validateResetPassword, setResetValid]
	)

	useEffect(() => {
		if (typeof resetToken === 'string' && typeof email === 'string') {
			validateResetToken(email, resetToken)
		}
	}, [email, resetToken])

	const handlePasswordResetClick = async values => {
		const response = await forgotPassword(values.email)
		if (response.status === 'success') {
			console.log('success')
			setSubmitMessage(null)
		} else {
			setSubmitMessage(response.message)
		}
	}

	const handleChangePasswordClick = async values => {
		console.log(values)
	}

	const handleGoBackClick = () => {
		router.back()
	}

	console.log(isResetValid)

	return (
		<div className={styles.body}>
			<Container>
				<Row className='justify-content-center'>
					<Col md={8} className={styles.mainContainer}>
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
									/>
								) : (
									<PasswordResetRequestForm
										submitMessage={submitMessage}
										passwordResetClick={handlePasswordResetClick}
										goBackClick={handleGoBackClick}
									/>
								)}
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</div>
	)
})
export default PasswordResetForm
