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
import type ComponentProps from '~types/ComponentProps'
import FormikField from '~ui/FormikField'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { UserRequest } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from '~hooks/api/useAuth'

interface AddSpecialistFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const NewNavigatorValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	lastName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	userName: yup.string().min(2, 'Too short').max(20, 'Too long!').required('Required'),
	password: yup.string().min(2, 'Too short').max(20, 'Too long!').required('Required'),
	email: yup.string().email('Invalid email').required('Required'),
	phone: yup.number().typeError('Must be numeric')
})

export default function AddSpecialistForm({
	title,
	className,
	closeForm
}: AddSpecialistFormProps): JSX.Element {
	const formTitle = title || 'Add Specialist'
	const { createSpecialist } = useSpecialist()
	const { authUser } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId

	const handleCreateSpecialist = async values => {
		const newUser: UserRequest = {
			first: values.firstName,
			middle: values.middleInital,
			last: values.lastName,
			password: values.password,
			userName: values.userName,
			email: values.email,
			phone: values.phone,
			roles: values.roles.map(role => {
				return {
					orgId: orgId,
					roleType: role
				}
			})
		}
		await createSpecialist(newUser)
		closeForm?.()
	}

	const roles = [
		{
			key: 'ADMIN',
			value: 'Admin'
		},
		{
			key: 'USER',
			value: 'User'
		},
		{
			key: 'VIEWER',
			value: 'Viewer'
		}
	]

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: '',
					middleInitial: '',
					lastName: '',
					userName: '',
					password: '',
					email: '',
					phone: '',
					roles: []
				}}
				validationSchema={NewNavigatorValidationSchema}
				onSubmit={values => {
					handleCreateSpecialist(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<>
							<Form>
								<FormTitle>
									{!values.firstName || !values.lastName
										? formTitle
										: `${values.firstName} ${values.middleInitial ?? ''} ${values.lastName}`}
								</FormTitle>
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
									{/* <Col>
										<DatePicker
											componentRef={datePickerRef}
											placeholder='Birthdate'
											allowTextInput
											ariaLabel='Select a date'
											value={birthdate}
											maxDate={maxDate}
											initialPickerDate={maxDate}
											onSelectDate={setBirthdate as (date: Date | null | undefined) => void}
											styles={{
												root: {
													border: 0
												},
												wrapper: {
													border: 0
												},
												textField: {
													border: '1px solid #979797',
													borderRadius: '4px',
													paddingTop: 4,
													'.ms-TextField-fieldGroup': {
														border: 0,
														height: 24,
														':after': {
															border: 0
														}
													}
												},
												icon: {
													paddingTop: 4
												}
											}}
										/>
									</Col> */}
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
										<FormikField
											name='password'
											type='password'
											placeholder='Temporary Password'
											className={cx(styles.field)}
											error={errors.password}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<FormSectionTitle>User Roles</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									{roles.map((role, idx) => {
										return (
											<Col md={2} key={idx} className={cx(styles.checkBox)}>
												<FormikField
													name='roles'
													type='checkbox'
													value={role.key}
													className={cx(styles.field)}
												/>
												<span>{role.value}</span>
											</Col>
										)
									})}
									<Col></Col>
								</Row>
								<FormSectionTitle>Add Contact info</FormSectionTitle>
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

								<FormikSubmitButton>Create Specialist</FormikSubmitButton>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
