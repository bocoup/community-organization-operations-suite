/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Row, Col } from 'react-bootstrap'
import FormikField from '~ui/FormikField'
import { Formik, Form } from 'formik'
import cx from 'classnames'
import { useAuthUser } from '~hooks/api/useAuth'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import { useRouter } from 'next/router'
import { wrap } from '~utils/appinsights'

interface LoginFormProps extends ComponentProps {
	onLoginClick?: (status: string) => void
	error?: string
}

const LoginForm = memo(function LoginForm({ onLoginClick, error }: LoginFormProps): JSX.Element {
	const { t } = useTranslation('login')
	const { login } = useAuthUser()
	const router = useRouter()
	const [loginMessage, setLoginMessage] = useState<{
		status: string
		message?: string
	} | null>()

	const handleLoginClick = async (values) => {
		const resp = await login(values.username, values.password)
		setLoginMessage(resp)
		onLoginClick?.(resp.status)
	}

	return (
		<>
			<Row className='mb-5'>
				<h2>{t('login.title')}</h2>
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
									name='username'
									placeholder={t('login.emailPlaceholder')}
									className={cx('mb-5', styles.formField)}
								/>
								<FormSectionTitle className='mb-3'>
									<>
										{t('login.passwordText')} <span className='text-danger'>*</span>
									</>
								</FormSectionTitle>
								<FormikField
									name='password'
									placeholder={t('login.passwordPlaceholder')}
									className={cx('mb-3', styles.formField)}
									type='password'
								/>
								<Col className='mb-3 ms-1'>
									<span
										className={styles.forgotPasswordLink}
										onClick={() => router.push('/passwordReset', undefined, { shallow: true })}
									>
										{t('login.forgotPasswordText')}
									</span>
								</Col>
								{loginMessage?.status === 'failed' && submitCount > 0 && (
									<div className='mb-2 text-danger'>{t('login.invalidLogin')}</div>
								)}
								{error && <div className='mb-2 ps-1 text-danger'>{error}</div>}
								<button type='submit' className={styles.loginButton}>
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
export default wrap(LoginForm)
