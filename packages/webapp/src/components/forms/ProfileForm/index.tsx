/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import { User, UserInput } from '@greenlight/schema/lib/client-types'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikButton from '~components/ui/FormikButton'
import FormikField from '~ui/FormikField'
import { Formik, Form } from 'formik'
import { useProfile } from '~hooks/api/useProfile'
import { useState } from 'react'
import { useSpecialist } from '~hooks/api/useSpecialist'

interface ProfileFormProps extends ComponentProps {
	user: User
}

export default function ProfileForm({ user }: ProfileFormProps): JSX.Element {
	const { setPassword } = useProfile()
	const { updateSpecialist } = useSpecialist()

	const [passwordMessage, setPasswordMessage] = useState<{
		status: string
		message?: string
	} | null>()

	const [saveMessage, setSaveMessage] = useState<{
		status: string
		message?: string
	} | null>()

	if (!user) return null

	const changePassword = async (newPassword: string) => {
		const response = await setPassword(newPassword)
		setPasswordMessage(response)
	}

	const saveUserProfile = async values => {
		const profileData: UserInput = {
			//default values
			id: user.id,
			userName: user.userName,
			roles: user.roles.map(r => {
				return {
					orgId: r.orgId,
					roleType: r.roleType
				}
			}),
			//form values
			first: values.firstName,
			middle: values.middleInitial,
			last: values.lastName,
			email: values.email,
			phone: values.phone,
			address: {
				street: values.street,
				unit: values.unit,
				city: values.city,
				state: values.state,
				zip: values.zip
			},
			description: values.description,
			additionalInfo: values.additionalInfo
		}
		const response = await updateSpecialist(profileData)

		setSaveMessage(response)
	}

	return (
		<Col className='mt-5 mb-5'>
			<Row className='align-items-center mb-3'>
				<Col>
					<h2 className='d-flex align-items-center'>My Profile</h2>
				</Col>
			</Row>
			<Row className={cx('g-0 pt-4 pb-3', styles.subHeaderContainer)}>
				<Col>
					Username:{' '}
					<span className='text-primary'>
						<strong>@{user?.userName}</strong>
					</span>
				</Col>
				<Col>
					User since: <strong>04/23/2001</strong>
				</Col>
				<Col>
					# of Currently Assigned Engagements: <strong>{user?.activeEngagementCount}</strong>
				</Col>
				<Col>
					Total Engagements Completed: <strong>47</strong>
				</Col>
				<Col></Col>
			</Row>
			<Row>
				<Formik
					initialValues={{
						firstName: user?.name?.first || '',
						middleInitial: user?.name?.middle || '',
						lastName: user?.name?.last || '',
						description: user?.description || '',
						additionalInfo: user?.additionalInfo || '',
						email: user?.email || '',
						phone: user?.phone || '',
						street: user?.address?.street || '',
						unit: user?.address?.unit || '',
						city: user?.address?.city || '',
						state: user?.address?.state || '',
						zip: user?.address?.zip || '',
						newPassword: ''
					}}
					onSubmit={values => {
						saveUserProfile(values)
					}}
				>
					{({ values, errors }) => {
						return (
							<Form>
								<Row>
									<Col md={5} className='me-5'>
										<FormSectionTitle className='mt-5 mb-3'>Name</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col md={5}>
												<FormikField
													name='firstName'
													placeholder='Firstname'
													className={cx(styles.field)}
													error={errors.firstName}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={2}>
												<FormikField
													name='middleInitial'
													placeholder='MI'
													className={cx(styles.field)}
													error={errors.middleInitial}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={5}>
												<FormikField
													name='lastName'
													placeholder='Lastname'
													className={cx(styles.field)}
													error={errors.lastName}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-1 mb-3'>My Bio</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													as='textarea'
													name='description'
													placeholder='About Me'
													className={cx(styles.field, styles.textareaField)}
													error={errors.description}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-1 mb-3'>
											My Trainings / Achievements
										</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													as='textarea'
													name='additionalInfo'
													placeholder='Additional info'
													className={cx(styles.field, styles.textareaField)}
													error={errors.additionalInfo}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<Row>
											<Col>
												<FormikSubmitButton className={cx(styles.submitButton)}>
													Save
												</FormikSubmitButton>
												{saveMessage &&
													(saveMessage.status === 'success' ? (
														<div className={cx('mt-5 alert alert-success')}>
															<strong>Success</strong>: your info has been saved.
														</div>
													) : (
														<div className={cx('mt-5 alert alert-danger')}>
															<strong>Save Failed</strong>: {saveMessage.message}
														</div>
													))}
											</Col>
										</Row>
									</Col>
									<Col md={4} className='ms-5'>
										<FormSectionTitle className='mt-5 mb-3'>Contact Info</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													name='email'
													placeholder='Email Address'
													className={cx(styles.field)}
													error={errors.email}
													errorClassName={cx(styles.errorLabel)}
												/>
												<FormikField
													name='phone'
													placeholder='Phone #'
													className={cx(styles.field)}
													error={errors.phone}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-5 mb-3'>Address</FormSectionTitle>
										<Row>
											<Col md={8}>
												<FormikField
													name='street'
													placeholder='Street'
													className={cx(styles.field)}
													error={errors.street}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={4}>
												<FormikField
													name='unit'
													placeholder='Unit #'
													className={cx(styles.field)}
													error={errors.unit}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													name='city'
													placeholder='City'
													className={cx(styles.field)}
													error={errors.city}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={2}>
												<FormikField
													name='state'
													placeholder='State'
													className={cx(styles.field)}
													error={errors.state}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={4}>
												<FormikField
													name='zip'
													placeholder='Zip Code'
													className={cx(styles.field)}
													error={errors.zip}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-5 mb-3'>User Password</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													name='newPassword'
													type='password'
													placeholder=''
													className={cx(styles.field)}
													error={errors.city}
													errorClassName={cx(styles.errorLabel)}
												/>
												<FormikButton
													type='button'
													disabled={values.newPassword.length === 0}
													className={cx(styles.changePasswordButton)}
													onClick={() => changePassword(values.newPassword)}
												>
													Change Password
												</FormikButton>
												{passwordMessage &&
													(passwordMessage.status === 'success' ? (
														<div className={cx('mt-5 alert alert-success')}>
															<strong>Success</strong>: password changed, please re-login and use
															your new password.
														</div>
													) : (
														<div className={cx('mt-5 alert alert-danger')}>
															<strong>Password Change Failed</strong>: {passwordMessage.message}
														</div>
													))}
											</Col>
										</Row>
									</Col>
								</Row>
							</Form>
						)
					}}
				</Formik>
			</Row>
		</Col>
	)
}
