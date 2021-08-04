/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import { Row, Col, Container } from 'react-bootstrap'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import { Formik, Form } from 'formik'
import FormikField from '~ui/FormikField'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useAuthUser } from '~hooks/api/useAuth'

const PasswordResetForm = memo(function PasswordResetForm(): JSX.Element {
	const { t } = useTranslation('passwordReset')
	const router = useRouter()
	const { forgotPassword } = useAuthUser()

	const PasswordResetValidationSchema = yup.object().shape({
		email: yup.string().email().required()
	})

	const handlePasswordResetClick = async values => {
		const response = await forgotPassword(values.email)
		if (response.status === 'success') {
			console.log('success')
		} else {
			console.log(response?.message)
		}
	}

	const handleGoBackClick = () => {
		router.back()
	}

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
								<Row>
									<Formik
										initialValues={{ email: '' }}
										validationSchema={PasswordResetValidationSchema}
										onSubmit={handlePasswordResetClick}
									>
										{({ submitCount, values, errors }) => {
											return submitCount > 0 ? (
												<Col>
													<Row>
														<h2>{t('passwordReset.resetSubmitted.text')}</h2>
														<p className='mb-5 mt-3'>{t('passwordReset.resetInstruction.text')}</p>
													</Row>
													<Row>
														<div>
															<button
																type='button'
																className={styles.resetPasswordButton}
																onClick={() => handleGoBackClick()}
															>
																{t('passwordReset.goBackButton.text')}
															</button>
														</div>
													</Row>
												</Col>
											) : (
												<Col>
													<Row>
														<h2>{t('passwordReset.title')}</h2>
														<p className={cx('mb-5 mt-3', styles.description)}>
															{t('passwordReset.description')}
														</p>
													</Row>
													<Form>
														<FormSectionTitle className='mb-3'>
															<>
																{t('passwordReset.email.text')}{' '}
																<span className='text-danger'>*</span>
															</>
														</FormSectionTitle>
														<FormikField
															name='email'
															type='email'
															placeholder={t('passwordReset.email.placeholder')}
															className={cx('mb-5', styles.formField)}
														/>
														<button
															type='submit'
															className={styles.resetPasswordButton}
															disabled={!values.email || !!errors.email}
														>
															{t('passwordReset.resetButton.text')}
														</button>
														<button
															type='button'
															className={cx(styles.resetPasswordButton, styles.normalButton)}
															onClick={() => handleGoBackClick()}
														>
															{t('passwordReset.goBackButton.text')}
														</button>
													</Form>
												</Col>
											)
										}}
									</Formik>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</div>
	)
})
export default PasswordResetForm
