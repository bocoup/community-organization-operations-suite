/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Row } from 'react-bootstrap'
import FormikField from '~ui/FormikField'
import { Formik, Form } from 'formik'
import cx from 'classnames'
import { useAuthUser } from '~hooks/api/useAuth'
import { memo, useState } from 'react'
import { useTranslation } from 'next-i18next'

interface LoginFormProps extends ComponentProps {
	onLoginClick?: (status: string) => void
}

const LoginForm = memo(function LoginForm({ onLoginClick }: LoginFormProps): JSX.Element {
	const { t } = useTranslation('login')
	const { login } = useAuthUser()
	const [loginMessage, setLoginMessage] =
		useState<{
			status: string
			message?: string
		} | null>()

	const handleLoginClick = async values => {
		const resp = await login(values.username, values.password)
		setLoginMessage(resp)
		onLoginClick?.(resp.status)
	}

	return (
		<>
			<Row className='mb-2'>
				<h2>{t('login.title')}</h2>
			</Row>
			<Row className='mb-2'>
				<p>{t('login.loginText')}</p>
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
								<FormikField
									name='username'
									placeholder={t('login.email.placeholder')}
									className={cx('mb-3', styles.formField)}
								/>
								<FormikField
									name='password'
									placeholder={t('login.password.placeholder')}
									className={cx('mb-3', styles.formField)}
									type='password'
								/>
								{loginMessage?.status === 'failed' && submitCount > 0 && (
									<div className='mb-2 ps-1 text-danger'>{t('login.invalidLogin')}</div>
								)}
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
export default LoginForm
