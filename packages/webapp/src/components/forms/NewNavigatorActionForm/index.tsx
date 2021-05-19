/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DatePicker, FontIcon, IDatePicker, addYears } from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import styles from './index.module.scss'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import type ComponentProps from '~types/ComponentProps'
import FormikField from '~ui/FormikField'

interface NewNavigatorActionFormProps extends ComponentProps {
	title?: string
}

const NewNavigatorValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too Short!').max(25, 'Too Long!').required('Required'),
	lastName: yup.string().min(2, 'Too Short!').max(25, 'Too Long!').required('Required'),
	email: yup.string().email('Invalid email'),
	phone: yup.number().typeError('Must be numeric'),
	zipCode: yup.number().typeError('Must be numeric')
})

export default function NewNavigatorActionForm({
	title,
	className
}: NewNavigatorActionFormProps): JSX.Element {
	const [birthdate, setBirthdate] = useState<Date | undefined>()
	const datePickerRef = useRef<IDatePicker>(null)
	const maxDate = useConst(addYears(new Date(Date.now()), -18))
	const formTitle = title || 'New User'

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: '',
					lastName: '',
					birthdate: '',
					email: '',
					phone: '',
					address: '',
					unit: '',
					city: '',
					state: '',
					zipCode: '',
					identifiers: ''
				}}
				validationSchema={NewNavigatorValidationSchema}
				onSubmit={values => {
					values.birthdate = new Intl.DateTimeFormat('en-US').format(birthdate)
					console.log('Form Submit', values)
				}}
			>
				{({ values, errors }) => {
					return (
						<>
							<Form>
								<FormTitle>
									{!values.firstName || !values.lastName
										? formTitle
										: `${values.firstName} ${values.lastName}`}
								</FormTitle>
								<Row>
									<div className={cx(styles.addPhoto)}>
										<FontIcon iconName='Camera' />
										<span>Add Photo</span>
									</div>
								</Row>
								<FormSectionTitle>Personal info</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='firstName'
											placeholder='Firstname'
											className={cx(styles.field)}
											error={errors.firstName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col>
										<FormikField
											name='lastName'
											placeholder='Lastname'
											className={cx(styles.field)}
											error={errors.lastName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col>
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
									</Col>
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
								<FormSectionTitle>Address</FormSectionTitle>
								<Row>
									<Col lg={8}>
										<FormikField
											name='address'
											placeholder='Address'
											className={cx(styles.field)}
											error={errors.address}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col lg={4}>
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
									<Col lg={6}>
										<FormikField
											name='city'
											placeholder='City'
											className={cx(styles.field)}
											error={errors.city}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col lg={2}>
										<FormikField
											name='state'
											placeholder='State'
											className={cx(styles.field)}
											error={errors.state}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col lg={4}>
										<FormikField
											name='zipCode'
											placeholder='Zipcode'
											className={cx(styles.field)}
											error={errors.zipCode as string}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<FormSectionTitle>Identifiers</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='identifiers'
											placeholder='Identifiers'
											className={cx(styles.field)}
											error={errors.identifiers}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>

								<FormikSubmitButton>Create User</FormikSubmitButton>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
