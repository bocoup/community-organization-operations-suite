/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Row, Col } from 'react-bootstrap'
import { FormikField } from '~ui/FormikField'
import { Formik, Form } from 'formik'
import cx from 'classnames'
import { useAuthUser } from '~hooks/api/useAuth'
import { useCallback, useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { wrap } from '~utils/appinsights'
import { Checkbox } from '@fluentui/react'
import { MessageResponse, StatusType } from '~hooks/api'
import { noop } from '~utils/noop'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'

interface LoginFormProps {
	onLoginClick?: (status: string) => void
	error?: string
}

export const LoginForm: StandardFC<LoginFormProps> = wrap(function LoginForm({
	onLoginClick = noop,
	error
}) {
	const { t } = useTranslation(Namespace.Login)
	const { login } = useAuthUser()
	const [acceptedAgreement, setAcceptedAgreement] = useState(false)
	const [loginMessage, setLoginMessage] = useState<MessageResponse | null>()

	const handleLoginClick = useCallback(
		async (values) => {
			const resp = await login(values.username, values.password)
			setLoginMessage(resp)
			onLoginClick(resp.status)
		},
		[login, setLoginMessage, onLoginClick]
	)
	const handlePasswordResetClick = useNavCallback(ApplicationRoute.PasswordReset)

	return (
		<>
			<Row className='mb-5'>
				<h2>{t('login.title')}</h2>
			</Row>
			<Row>
				<Checkbox
					className='mb-5 btnConsent'
					key={'user-sign-in-agreement'}
					label={t('login.agreement')}
					onChange={(e, checked) => {
						setAcceptedAgreement(checked)
					}}
				/>
			</Row>
			<Row>
				<Formik
					initialValues={{
						username: '',
						password: ''
					}}
					onSubmit={handleLoginClick}
				>
					{({ submitCount }) => {
						return (
							<Form>
								<FormSectionTitle className='mb-3'>
									<>
										{t('login.emailText')} <span className='text-danger'>*</span>
									</>
								</FormSectionTitle>
								<FormikField
									disabled={!acceptedAgreement}
									name='username'
									placeholder={t('login.emailPlaceholder')}
									className={cx('mb-5', styles.formField, 'loginUsername')}
								/>
								<FormSectionTitle className='mb-3'>
									<>
										{t('login.passwordText')} <span className='text-danger'>*</span>
									</>
								</FormSectionTitle>
								<FormikField
									disabled={!acceptedAgreement}
									name='password'
									placeholder={t('login.passwordPlaceholder')}
									className={cx('mb-3', styles.formField, 'loginPassword')}
									type='password'
								/>
								<Col className='mb-3 ms-1'>
									<span className={styles.forgotPasswordLink} onClick={handlePasswordResetClick}>
										{t('login.forgotPasswordText')}
									</span>
								</Col>
								{loginMessage?.status === StatusType.Failed && submitCount > 0 && (
									<div className='mb-2 text-danger'>{t('login.invalidLogin')}</div>
								)}
								{error && <div className='mb-2 ps-1 text-danger'>{error}</div>}
								<button
									type='submit'
									className={cx(styles.loginButton, 'btn btn-primary btnLogin')}
									disabled={!acceptedAgreement}
								>
									{t('login.title')}
								</button>
							</Form>
						)
					}}
				</Formik>
			</Row>
		</>
	)
})
