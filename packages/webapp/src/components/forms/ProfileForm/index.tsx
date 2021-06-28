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
import { memo, useState } from 'react'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { getCreatedOnValue } from '~utils/getCreatedOnValue'
import useWindowSize from '~hooks/useWindowSize'
import * as yup from 'yup'
interface ProfileFormProps extends ComponentProps {
	user: User
}

const changePasswordSchema = yup.object({
	currentPassword: yup.string().required('Please enter your current password'),
	newPassword: yup
		.string()
		.required('Please enter your new password')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
		),
	confirmNewPassword: yup
		.string()
		.required('Please confirm your new password')
		.oneOf([yup.ref('newPassword'), null], 'Passwords must match')
})

const profileSchema = yup.object({
	firstName: yup.string().required('Please enter your first name'),
	lastName: yup.string().required('Please enter your last name'),
	email: yup.string().email().required('Please enter your email address')
})

const ProfileForm = memo(function ProfileForm({ user }: ProfileFormProps): JSX.Element {
	const { isMD } = useWindowSize()
	const { setPassword } = useProfile()
	const { updateSpecialist } = useSpecialist()

	const [passwordMessage, setPasswordMessage] =
		useState<{
			status: string
			message?: string
		} | null>()

	const [saveMessage, setSaveMessage] =
		useState<{
			status: string
			message?: string
		} | null>()

	if (!user) return null

	const changePassword = async values => {
		const response = await setPassword(values.currentPassword, values.newPassword)
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

	const createdOn = getCreatedOnValue(user?.oid, false, false)

	return (
		<Col className='mt-5 mb-5'>
			<Row className='align-items-center mb-3'>
				<Col>
					<h2 className='d-flex align-items-center'>My Profile</h2>
				</Col>
			</Row>
			<Row className={cx('g-0 pt-4 pb-3', styles.subHeaderContainer)}>
				<Col md={3} sm={12}>
					Username:{' '}
					<span className='text-primary'>
						<strong>@{user?.userName}</strong>
					</span>
				</Col>
				<Col md={3} sm={12}>
					User since: <strong>{createdOn}</strong>
				</Col>
				<Col md={3} sm={12}>
					# of Currently Assigned Engagements: <strong>{user?.engagementCounts.active}</strong>
				</Col>
				<Col md={3} sm={12}>
					Total Engagements Completed: <strong>{user?.engagementCounts.closed}</strong>
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
						zip: user?.address?.zip || ''
					}}
					onSubmit={values => {
						saveUserProfile(values)
					}}
					validationSchema={profileSchema}
				>
					{({ errors }) => {
						return (
							<Form>
								<Row>
									<Col md={5} sm={12} className={isMD ? 'me-5' : null}>
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
										<Row className={isMD ? 'mb-4 pb-2' : null}>
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
										{isMD && (
											<Row>
												<Col>
													<FormikSubmitButton
														className={cx(styles.submitButton)}
														disabled={Object.keys(errors).length > 0}
													>
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
										)}
									</Col>
									<Col md={4} sm={12} className={isMD ? 'ms-5' : null}>
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
										{!isMD && (
											<Row>
												<Col>
													<FormikSubmitButton
														className={cx(styles.submitButton)}
														disabled={Object.keys(errors).length > 0}
													>
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
										)}
									</Col>
								</Row>
							</Form>
						)
					}}
				</Formik>
				<Formik
					initialValues={{
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: ''
					}}
					validationSchema={changePasswordSchema}
					onSubmit={values => {
						changePassword(values)
					}}
				>
					{({ errors }) => {
						return (
							<Form>
								<FormSectionTitle className='mt-5 mb-3'>Password</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col md={5} sm={12}>
										<FormikField
											name='currentPassword'
											type='password'
											placeholder='Current password'
											className={cx(styles.field)}
											error={errors.currentPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='newPassword'
											type='password'
											placeholder='New password'
											className={cx(styles.field)}
											error={errors.newPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='confirmNewPassword'
											type='password'
											placeholder='Confirm new password'
											className={cx(styles.field)}
											error={errors.confirmNewPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikButton
											type='submit'
											disabled={Object.keys(errors).length > 0}
											className={cx('mt-5', styles.changePasswordButton)}
										>
											Change Password
										</FormikButton>
										{passwordMessage &&
											(passwordMessage.status === 'success' ? (
												<div className={cx('mt-5 alert alert-success')}>
													<strong>Success</strong>: password changed, please re-login and use your
													new password.
												</div>
											) : (
												<div className={cx('mt-5 alert alert-danger')}>
													<strong>Password Change Failed</strong>: {passwordMessage.message}
												</div>
											))}
									</Col>
								</Row>
							</Form>
						)
					}}
				</Formik>
			</Row>
		</Col>
	)
})
export default ProfileForm
