/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import styles from './index.module.scss'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikButton from '~components/ui/FormikButton'
import type ComponentProps from '~types/ComponentProps'
import FormikField from '~ui/FormikField'
import { RoleTypeInput, User } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from '~hooks/api/useAuth'
import { useState } from 'react'

interface EditSpecialistFormProps extends ComponentProps {
	title?: string
	specialist: User
	closeForm?: () => void
}

const EditSpecialistValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	lastName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	userName: yup.string().min(2, 'Too short').max(20, 'Too long!').required('Required'),
	email: yup.string().email('Invalid email').required('Required'),
	phone: yup.string()
})

export default function EditSpecialistForm({
	title,
	className,
	specialist,
	closeForm
}: EditSpecialistFormProps): JSX.Element {
	const formTitle = title || 'Edit Specialist'
	//const { createSpecialist } = useSpecialist()
	const { authUser, resetPassword } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId
	const [submitMessage, setSubmitMessage] = useState<{ status: string; message?: string } | null>(
		null
	)

	const handleEditSpecialist = async values => {
		const defaultRoles: RoleTypeInput[] = [
			{
				orgId: orgId,
				roleType: 'USER'
			}
		]

		if (values.admin) {
			defaultRoles.push({ orgId: orgId, roleType: 'ADMIN' })
		}

		// const editUser: UserInput = {
		// 	first: values.firstName,
		// 	middle: values.middleInital,
		// 	last: values.lastName,
		// 	userName: values.userName,
		// 	email: values.email,
		// 	phone: values.phone,
		// 	roles: defaultRoles
		// }

		//await createSpecialist(editUser)
		closeForm?.()
	}

	const sendPasswordReset = async (sid: string) => {
		const response = await resetPassword(sid)
		setSubmitMessage(response)
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: specialist.name.first,
					middleInitial: specialist.name.middle,
					lastName: specialist.name.last,
					userName: specialist.userName,
					email: specialist.email,
					phone: specialist.phone,
					admin: specialist.roles.some(r => r.roleType === 'ADMIN')
				}}
				validationSchema={EditSpecialistValidationSchema}
				onSubmit={values => {
					handleEditSpecialist(values)
				}}
			>
				{({ errors }) => {
					return (
						<>
							<Form>
								<FormTitle>{formTitle}</FormTitle>
								<FormSectionTitle className='mt-5'>Specialist info</FormSectionTitle>
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
								<FormSectionTitle>Username</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='userName'
											placeholder='Username'
											className={cx(styles.field)}
											error={errors.userName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<FormSectionTitle>Admin Role</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col className={cx(styles.checkBox)}>
										<FormikField name='admin' type='checkbox' className={cx(styles.field)} />
										<span>Does this specialist require elevated privileges?</span>
									</Col>
								</Row>
								<FormSectionTitle>Edit Contact info</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='email'
											placeholder='Email address'
											className={cx(styles.field)}
											error={errors.email}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='phone'
											placeholder='Phone #'
											className={cx(styles.field)}
											error={errors.phone as string}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>

								<FormikSubmitButton className={cx(styles.submitButton)}>Save</FormikSubmitButton>
								<FormikButton
									type='button'
									className={cx(styles.passwordResetButton)}
									onClick={() => sendPasswordReset(specialist.id)}
								>
									Send Password Reset
								</FormikButton>
								{submitMessage &&
									(submitMessage.status === 'success' ? (
										<div className={cx('mt-5 alert alert-success')}>
											<strong>Password Reset Success</strong>: a reset password has been sent to the
											specialist&apos;s email on record.
										</div>
									) : (
										<div className={cx('mt-5 alert alert-danger')}>
											<strong>Password Reset Failed</strong>: {submitMessage.message}
										</div>
									))}
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
