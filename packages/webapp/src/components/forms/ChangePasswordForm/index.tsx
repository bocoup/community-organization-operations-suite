/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Formik, Form } from 'formik'
import FormikField from '~ui/FormikField'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import * as yup from 'yup'
import { Row, Col } from 'react-bootstrap'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'

interface ChangePasswordFormProps extends ComponentProps {
	submitMessage: string
	changePasswordClick?: (newPassword: string) => void
}

const ChangePasswordForm = memo(function ChangePasswordForm({
	submitMessage,
	changePasswordClick
}: ChangePasswordFormProps): JSX.Element {
	const { t } = useTranslation('passwordReset')
	const ValidPasswordResetValidationSchema = yup.object().shape({
		newPassword: yup.string().required(),
		confirmNewPassword: yup
			.string()
			.required()
			.oneOf([yup.ref('newPassword'), null], 'Password must match')
	})

	return (
		<Row>
			<Formik
				initialValues={{ newPassword: '', confirmNewPassword: '' }}
				validationSchema={ValidPasswordResetValidationSchema}
				onSubmit={values => changePasswordClick(values.newPassword)}
				enableReinitialize
			>
				{({ values, errors }) => {
					;<Col>
						<Row>
							<h2>{t('passwordReset.title')}</h2>
							<p className={cx('mb-5 mt-3', styles.description)}>
								{t('passwordReset.description')}
							</p>
						</Row>
						<Form>
							<FormSectionTitle className='mb-3'>
								<>
									New password <span className='text-danger'>*</span>
								</>
							</FormSectionTitle>
							<FormikField
								name='newPassword'
								type='password'
								placeholder={'Enter new password'}
								className={cx(submitMessage ? 'mb-2' : 'mb-5', styles.formField)}
							/>
							<FormSectionTitle className='mb-3'>
								<>
									Confirm password <span className='text-danger'>*</span>
								</>
							</FormSectionTitle>
							<FormikField
								name='confirmNewPassword'
								type='password'
								placeholder={'Confirm new password'}
								className={cx(submitMessage ? 'mb-2' : 'mb-5', styles.formField)}
							/>
							<button
								type='submit'
								className={styles.resetPasswordButton}
								disabled={
									!values?.newPassword ||
									!!errors?.newPassword ||
									!values?.confirmNewPassword ||
									!!errors?.confirmNewPassword
								}
							>
								Change password
							</button>
						</Form>
					</Col>
				}}
			</Formik>
		</Row>
	)
})
export default ChangePasswordForm
