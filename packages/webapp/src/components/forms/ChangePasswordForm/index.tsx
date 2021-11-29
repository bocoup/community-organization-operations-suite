/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Formik, Form } from 'formik'
import { FormikField } from '~ui/FormikField'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import * as yup from 'yup'
import { Row, Col } from 'react-bootstrap'
import cx from 'classnames'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { FC, memo } from 'react'

interface ChangePasswordFormProps {
	submitMessage: string
	complete?: boolean
	changePasswordClick?: (values: Record<string, string>) => void
}

export const ChangePasswordForm: StandardFC<ChangePasswordFormProps> = wrap(
	function ChangePasswordForm({ submitMessage, complete, changePasswordClick = noop }) {
		const { t } = useTranslation(Namespace.PasswordReset)

		const ValidPasswordResetValidationSchema = yup.object().shape({
			newPassword: yup
				.string()
				.required(t('changePasswordForm.yup.required'))
				.matches(
					/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
					t('changePasswordForm.yup.passwordComplexity')
				),
			confirmNewPassword: yup
				.string()
				.required(t('changePasswordForm.yup.required'))
				.oneOf([yup.ref('newPassword'), null], t('changePasswordForm.yup.matchPassword'))
		})
		return complete ? (
			<ChangePasswordFormComplete />
		) : (
			<Row>
				<Formik
					validateOnMount={false}
					initialValues={{ newPassword: '', confirmNewPassword: '' }}
					validationSchema={ValidPasswordResetValidationSchema}
					onSubmit={changePasswordClick}
				>
					{({ submitCount, values, errors }) => {
						return (
							<Col>
								<Row>
									<h2>{t('changePasswordForm.title')}</h2>
									<p className={cx('mb-5 mt-3', styles.description)}>
										{t('changePasswordForm.description')}
									</p>
								</Row>
								<Form>
									<FormSectionTitle className='mb-3'>
										<>
											{t('changePasswordForm.newpasswordText')}{' '}
											<span className='text-danger'>*</span>
										</>
									</FormSectionTitle>
									<FormikField
										name='newPassword'
										type='password'
										placeholder={t('changePasswordForm.newPasswordPlaceholder')}
										className={styles.formField}
										error={errors.newPassword as string}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormSectionTitle className='mt-5 mb-3'>
										<>
											{t('changePasswordForm.confirmPasswordText')}{' '}
											<span className='text-danger'>*</span>
										</>
									</FormSectionTitle>
									<FormikField
										name='confirmNewPassword'
										type='password'
										placeholder={t('changePasswordForm.confirmPasswordPlaceholder')}
										className={styles.formField}
										error={errors.confirmNewPassword as string}
										errorClassName={styles.errorLabel}
									/>
									{submitMessage && (
										<div className={cx('mb-5 alert alert-danger')}>{submitMessage}</div>
									)}
									<button
										type='submit'
										className={cx('mt-5 w-100', styles.resetPasswordButton)}
										disabled={
											!values?.newPassword ||
											!!errors?.newPassword ||
											!values?.confirmNewPassword ||
											!!errors?.confirmNewPassword
										}
									>
										{t('changePasswordForm.changePasswordButtonText')}
									</button>
								</Form>
							</Col>
						)
					}}
				</Formik>
			</Row>
		)
	}
)

const ChangePasswordFormComplete: FC = memo(function ChangePasswordFormComplete() {
	const { t } = useTranslation(Namespace.PasswordReset)
	const goToLogin = useNavCallback(ApplicationRoute.Login)
	return (
		<Col>
			<Row>
				<h2>{t('changePasswordForm.changePasswordSuccessText')}</h2>
				<p className='mb-5 mt-3'>{t('changePasswordForm.changePasswordSuccessDescription')}</p>
			</Row>
			<Row>
				<div>
					<button type='button' className={styles.resetPasswordButton} onClick={goToLogin}>
						{t('changePasswordForm.goBackButtonText')}
					</button>
				</div>
			</Row>
		</Col>
	)
})
