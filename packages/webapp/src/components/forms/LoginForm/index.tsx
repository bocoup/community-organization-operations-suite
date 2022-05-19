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

	const handleLoginClick = useCallback(
		async (values) => {
			const resp = await login(values.username, values.password)
			onLoginClick(resp.status)
		},
		[login, onLoginClick]
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
					{() => {
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
								{error && <div className='mb-2 ps-1 text-danger'>{error}</div>}
								<div className={styles.kioskModeContainer}>
									<div className={styles.kioskModeIcon}>
										<svg
											width='48'
											height='48'
											viewBox='0 0 48 48'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M33.7322 35.5L41.8661 43.6339C42.3543 44.122 43.1457 44.122 43.6339 43.6339C44.122 43.1457 44.122 42.3543 43.6339 41.8661L6.13388 4.36612C5.64573 3.87796 4.85427 3.87796 4.36612 4.36612C3.87796 4.85427 3.87796 5.64573 4.36612 6.13388L14.2105 15.9783C13.5809 17.2032 13.1745 18.5617 13.0448 20H12.75C8.46979 20 5 23.4698 5 27.75C5 32.0302 8.46979 35.5 12.75 35.5H33.7322ZM31.2322 33H12.75C9.8505 33 7.5 30.6495 7.5 27.75C7.5 24.8505 9.8505 22.5 12.75 22.5H14.25C14.9404 22.5 15.5 21.9404 15.5 21.25V21C15.5 19.8927 15.7117 18.8348 16.0969 17.8647L31.2322 33ZM40.5 27.75C40.5 29.7651 39.3647 31.5151 37.6988 32.3951L39.5214 34.2177C41.6175 32.8306 43 30.4517 43 27.75C43 23.4698 39.5302 20 35.25 20H34.9552C34.4499 14.3935 29.738 10 24 10C21.5501 10 19.2872 10.8009 17.4589 12.1552L19.2522 13.9485C20.6079 13.0339 22.2416 12.5 24 12.5C28.6944 12.5 32.5 16.3056 32.5 21V21.25C32.5 21.9404 33.0596 22.5 33.75 22.5H35.25C38.1495 22.5 40.5 24.8505 40.5 27.75Z'
												fill='#212121'
											/>
										</svg>
									</div>
									<div className={styles.kioskModeAction}>
										<span className={styles.kioskModeText}>{t('login.offline')}</span>
										<button
											className='btn btn-link text-decoration-none'
											type='button'
											onClick={() => {}}
										>
											{t('login.kioskMode')}
										</button>
									</div>
								</div>
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
