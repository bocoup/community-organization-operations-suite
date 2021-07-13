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
import { memo, useEffect, useState } from 'react'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { getCreatedOnValue } from '~utils/getCreatedOnValue'
import useWindowSize from '~hooks/useWindowSize'
import * as yup from 'yup'
import { useTranslation } from '~hooks/useTranslation'
interface ProfileFormProps extends ComponentProps {
	user: User
}

const ProfileForm = memo(function ProfileForm({
	user: internalUser
}: ProfileFormProps): JSX.Element {
	const { t } = useTranslation('account')
	const { isMD } = useWindowSize()
	const { setPassword } = useProfile()
	const { updateSpecialist, specialistList } = useSpecialist()
	const [user, setUser] = useState<User>(internalUser)

	useEffect(() => {
		if (specialistList.length > 0) {
			const user = specialistList.find(u => u.oid === internalUser.oid)
			setUser(user)
		}
	}, [specialistList, internalUser, setUser])

	const changePasswordSchema = yup.object({
		currentPassword: yup.string().required(t('account.yup.currentPassword')),
		newPassword: yup
			.string()
			.required(t('account.yup.newPassword'))
			.matches(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
				t('account.yup.passwordPattern')
			)
			.notOneOf([yup.ref('currentPassword')], t('account.yup.mustBeDiffPassword')),
		confirmNewPassword: yup
			.string()
			.required(t('account.yup.confirmPassword'))
			.oneOf([yup.ref('newPassword'), null], t('account.yup.matchPassword'))
	})

	const profileSchema = yup.object({
		firstName: yup.string().required(t('account.yup.firstName')),
		lastName: yup.string().required(t('account.yup.lastName')),
		email: yup.string().email().required(t('account.yup.email'))
	})

	const [passwordMessage, setPasswordMessage] = useState<{
		status: string
		message?: string
	} | null>()

	const [saveMessage, setSaveMessage] = useState<{
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
					<h2 className='d-flex align-items-center'>{t('account.header.title')}</h2>
				</Col>
			</Row>
			<Row className={cx('g-0 pt-4 pb-3', styles.subHeaderContainer)}>
				<Col md={3} sm={12}>
					{t('account.header.userName')}:{' '}
					<span className='text-primary'>
						<strong>@{user?.userName}</strong>
					</span>
				</Col>
				<Col md={3} sm={12}>
					{t('account.header.userSince')}: <strong>{createdOn}</strong>
				</Col>
				<Col md={3} sm={12}>
					{t('account.header.numOfAssignedEngagements')}:{' '}
					<strong>{user?.engagementCounts?.active || 0}</strong>
				</Col>
				<Col md={3} sm={12}>
					{t('account.header.totalEngagementCompleted')}:{' '}
					<strong>{user?.engagementCounts?.closed || 0}</strong>
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
										<FormSectionTitle className='mt-5 mb-3'>
											{t('account.fields.nameInfo')}
										</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col md={5}>
												<FormikField
													name='firstName'
													placeholder={t('account.fields.firstName.placeholder')}
													className={cx(styles.field)}
													error={errors.firstName}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={2}>
												<FormikField
													name='middleInitial'
													placeholder={t('account.fields.middle.placeholder')}
													className={cx(styles.field)}
													error={errors.middleInitial}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={5}>
												<FormikField
													name='lastName'
													placeholder={t('account.fields.lastName.placeholder')}
													className={cx(styles.field)}
													error={errors.lastName}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-1 mb-3'>
											{t('account.fields.bioInfo')}
										</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													as='textarea'
													name='description'
													placeholder={t('account.fields.myBio.placeholder')}
													className={cx(styles.field, styles.textareaField)}
													error={errors.description}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-1 mb-3'>
											{t('account.fields.trainingsAchivementInfo')}
										</FormSectionTitle>
										<Row className={isMD ? 'mb-4 pb-2' : null}>
											<Col>
												<FormikField
													as='textarea'
													name='additionalInfo'
													placeholder={t('account.fields.trainingAchievement.placeholder')}
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
														{t('account.buttons.save')}
													</FormikSubmitButton>
													{saveMessage &&
														(saveMessage.status === 'success' ? (
															<div className={cx('mt-5 alert alert-success')}>
																{t('account.submitMessage.success')}
															</div>
														) : (
															<div className={cx('mt-5 alert alert-danger')}>
																{t('account.submitMessage.failed')}
															</div>
														))}
												</Col>
											</Row>
										)}
									</Col>
									<Col md={4} sm={12} className={isMD ? 'ms-5' : null}>
										<FormSectionTitle className='mt-5 mb-3'>
											{t('account.fields.contactInfo')}
										</FormSectionTitle>
										<Row className='mb-4 pb-2'>
											<Col>
												<FormikField
													name='email'
													placeholder={t('account.fields.email.placeholder')}
													className={cx(styles.field)}
													error={errors.email}
													errorClassName={cx(styles.errorLabel)}
												/>
												<FormikField
													name='phone'
													placeholder={t('account.fields.phone.placeholder')}
													className={cx(styles.field)}
													error={errors.phone}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
										</Row>
										<FormSectionTitle className='mt-5 mb-3'>
											{t('account.fields.address')}
										</FormSectionTitle>
										<Row>
											<Col md={8}>
												<FormikField
													name='street'
													placeholder={t('account.fields.street.placeholder')}
													className={cx(styles.field)}
													error={errors.street}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={4}>
												<FormikField
													name='unit'
													placeholder={t('account.fields.unit.placeholder')}
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
													placeholder={t('account.fields.city.placeholder')}
													className={cx(styles.field)}
													error={errors.city}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={2}>
												<FormikField
													name='state'
													placeholder={t('account.fields.state.placeholder')}
													className={cx(styles.field)}
													error={errors.state}
													errorClassName={cx(styles.errorLabel)}
												/>
											</Col>
											<Col md={4}>
												<FormikField
													name='zip'
													placeholder={t('account.fields.zipCode.placeholder')}
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
														{t('account.buttons.save')}
													</FormikSubmitButton>
													{saveMessage &&
														(saveMessage.status === 'success' ? (
															<div className={cx('mt-5 alert alert-success')}>
																{t('account.submitMessage.success')}
															</div>
														) : (
															<div className={cx('mt-5 alert alert-danger')}>
																{t('account.submitMessage.failed')}
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
								<FormSectionTitle className='mt-5 mb-3'>
									{t('account.fields.passwordInfo')}
								</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col md={5} sm={12}>
										<FormikField
											name='currentPassword'
											type='password'
											placeholder={t('account.fields.currentPassword.placeholder')}
											className={cx(styles.field)}
											error={errors.currentPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='newPassword'
											type='password'
											placeholder={t('account.fields.newPassword.placeholder')}
											className={cx(styles.field)}
											error={errors.newPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='confirmNewPassword'
											type='password'
											placeholder={t('account.fields.confirmPassword.placeholder')}
											className={cx(styles.field)}
											error={errors.confirmNewPassword}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikButton
											type='submit'
											disabled={Object.keys(errors).length > 0}
											className={cx('mt-5', styles.changePasswordButton)}
										>
											{t('account.buttons.changePassword')}
										</FormikButton>
										{passwordMessage &&
											(passwordMessage.status === 'success' ? (
												<div className={cx('mt-5 alert alert-success')}>
													{t('account.changePasswordMessage.success')}
												</div>
											) : (
												<div className={cx('mt-5 alert alert-danger')}>
													{t('account.changePasswordMessage.failed')}
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
