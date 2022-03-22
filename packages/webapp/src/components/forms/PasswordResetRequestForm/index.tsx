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
import type { FC } from 'react'
import { memo } from 'react'

interface PasswordResetRequestFormProps {
	submitMessage?
	complete?: boolean
	passwordResetClick?: (values) => void
}

export const PasswordResetRequestForm: StandardFC<PasswordResetRequestFormProps> = wrap(
	function PasswordResetRequestForm({ submitMessage, complete, passwordResetClick = noop }) {
		const { t } = useTranslation(Namespace.PasswordReset)
		const goToLogin = useNavCallback(ApplicationRoute.Login)
		const PasswordResetValidationSchema = yup.object().shape({
			email: yup.string().email().required()
		})

		return complete ? (
			<PasswordResetRequestFormComplete />
		) : (
			<Row>
				<Formik
					initialValues={{ email: '' }}
					validationSchema={PasswordResetValidationSchema}
					onSubmit={passwordResetClick}
				>
					{({ submitCount, values, errors }) => {
						return (
							<Col>
								<Row>
									<h2>{t('passwordResetRequestForm.title')}</h2>
									<p className={cx('mb-5 mt-3', styles.description)}>
										{t('passwordResetRequestForm.description')}
									</p>
								</Row>
								<Form>
									<FormSectionTitle className='mb-3'>
										<>
											{t('passwordResetRequestForm.emailText')}{' '}
											<span className='text-danger'>*</span>
										</>
									</FormSectionTitle>
									<FormikField
										name='email'
										type='email'
										placeholder={t('passwordResetRequestForm.emailPlaceholder')}
										className={cx(submitMessage ? 'mb-2' : 'mb-5', styles.formField)}
									/>
									{submitMessage && (
										<div className={cx('mb-5 alert alert-danger')}>{submitMessage}</div>
									)}
									<button
										type='submit'
										className={cx('mb-3', styles.resetPasswordButton)}
										disabled={!values.email || !!errors.email}
									>
										{t('passwordResetRequestForm.resetButtonText')}
									</button>
									<button
										type='button'
										className={cx(styles.resetPasswordButton, styles.normalButton)}
										onClick={goToLogin}
									>
										{t('passwordResetRequestForm.goBackButtonText')}
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

const PasswordResetRequestFormComplete: FC = memo(function PasswordResetRequestFormComplete() {
	const { t } = useTranslation(Namespace.PasswordReset)
	const goToLogin = useNavCallback(ApplicationRoute.Login)
	return (
		<Col>
			<Row>
				<h2>{t('passwordResetRequestForm.resetSubmittedText')}</h2>
				<p className='mb-5 mt-3'>{t('passwordResetRequestForm.resetInstructionText')}</p>
			</Row>
			<Row>
				<div>
					<button type='button' className={styles.resetPasswordButton} onClick={goToLogin}>
						{t('passwordResetRequestForm.goBackButtonText')}
					</button>
				</div>
			</Row>
		</Col>
	)
})
