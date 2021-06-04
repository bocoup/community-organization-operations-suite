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

interface LoginFormProps extends ComponentProps {
	loginSuccess: boolean
}

export default function LoginForm({ onClick, loginSuccess }: LoginFormProps): JSX.Element {
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
					onSubmit={onClick}
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
								{!loginSuccess && submitCount > 0 && (
									<div className='mb-2 text-danger'>
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
