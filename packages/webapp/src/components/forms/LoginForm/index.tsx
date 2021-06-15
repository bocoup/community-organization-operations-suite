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
import { useState } from 'react'

interface LoginFormProps extends ComponentProps {
	onLoginClick?: (status: string) => void
}

export default function LoginForm({ onLoginClick }: LoginFormProps): JSX.Element {
	const { login } = useAuthUser()
	const [loginMessage, setLoginMessage] = useState<{
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
				<h2>Login</h2>
			</Row>
			<Row className='mb-2'>
				<p>Please login to continue</p>
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
									placeholder='Email'
									className={cx('mb-3', styles.formField)}
								/>
								<FormikField
									name='password'
									placeholder='Password'
									className={cx('mb-3', styles.formField)}
									type='password'
								/>
								{loginMessage?.status === 'failed' && submitCount > 0 && (
									<div className='mb-2 ps-1 text-danger'>
										Invalid email or password. Please try again.
									</div>
								)}
								<button type='submit' className={styles.loginButton}>
									Login
								</button>
							</Form>
						)
					}}
				</Formik>
			</Row>
		</>
	)
}
