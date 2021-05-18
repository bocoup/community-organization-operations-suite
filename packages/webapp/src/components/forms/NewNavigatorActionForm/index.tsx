/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DatePicker, FontIcon, IDatePicker, PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import { Formik, Form, Field } from 'formik'
import { useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

interface NewNavigatorActionFormProps extends ComponentProps {
	title?: string
}

export default function NewNavigatorActionForm({
	className
}: NewNavigatorActionFormProps): JSX.Element {
	const [birthdate, setBirthdate] = useState<Date | undefined>()
	const datePickerRef = useRef<IDatePicker>(null)

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
				onSubmit={values => {
					values.birthdate = new Intl.DateTimeFormat('en-US').format(birthdate)
					console.log('Form Submit', values)
				}}
			>
				{({ values, errors, touched }) => {
					const hasError = errors.firstName && touched.firstName
					return (
						<>
							<h3 className={cx(styles.header)}>
								{values.firstName || 'Firstname'} {values.lastName || 'Lastname'}
							</h3>
							<Form>
								<section className={cx(styles.section)}>
									<div className={cx(styles.addPhoto)}>
										<FontIcon iconName='Camera' />
										<span>Add Photo</span>
									</div>
								</section>
								<section className={cx(styles.section)}>
									<Row className={cx(styles.rowLabel)}>
										<Col>
											<span>Personal info</span>
										</Col>
									</Row>
									<Row>
										<Col>
											<Field
												name='firstName'
												placeholder='Firstname'
												className={cx(styles.field)}
											/>
										</Col>
										<Col>
											<Field name='lastName' placeholder='Lastname' className={cx(styles.field)} />
										</Col>
										<Col>
											<DatePicker
												componentRef={datePickerRef}
												placeholder='Birthdate'
												allowTextInput
												ariaLabel='Select a date'
												value={birthdate}
												onSelectDate={setBirthdate as (date: Date | null | undefined) => void}
												styles={{
													root: {
														border: 0
													},
													wrapper: {
														border: 0
													},
													textField: {
														border: '1px solid #ccc',
														borderRadius: '5px',
														paddingTop: 4,
														'.ms-TextField-fieldGroup': {
															border: 0,
															height: 28,
															':after': {
																border: 0
															}
														}
													}
												}}
											/>
										</Col>
									</Row>
								</section>
								<section className={cx(styles.section)}>
									<Row className={cx(styles.rowLabel)}>
										<Col>
											<span>Add Contact info</span>
										</Col>
									</Row>
									<Row>
										<Col>
											<Field
												name='email'
												placeholder='Email address'
												className={cx(styles.field)}
											/>
											<Field name='phone' placeholder='Phone #' className={cx(styles.field)} />
										</Col>
									</Row>
								</section>
								<section className={cx(styles.section)}>
									<Row className={cx(styles.rowLabel)}>
										<Col>
											<span>Address</span>
										</Col>
									</Row>
									<Row>
										<Col lg={8}>
											<Field name='address' placeholder='Address' className={cx(styles.field)} />
										</Col>
										<Col lg={4}>
											<Field name='unit' placeholder='Unit #' className={cx(styles.field)} />
										</Col>
									</Row>
									<Row>
										<Col>
											<Field name='city' placeholder='City' className={cx(styles.field)} />
										</Col>
										<Col>
											<Field name='state' placeholder='State' className={cx(styles.field)} />
										</Col>
										<Col>
											<Field name='zipCode' placeholder='Zip Code' className={cx(styles.field)} />
										</Col>
									</Row>
								</section>
								<section className={cx(styles.section)}>
									<Row className={cx(styles.rowLabel)}>
										<Col>
											<span>Identifiers</span>
										</Col>
									</Row>
									<Row>
										<Col>
											<Field
												name='identifiers'
												placeholder='Identifiers'
												className={cx(styles.field)}
											/>
										</Col>
									</Row>
								</section>
								<section className={cx(styles.section)}>
									<Row>
										<Col>
											<PrimaryButton type='submit' className={cx(styles.submitButton)}>
												Create User
											</PrimaryButton>
										</Col>
									</Row>
								</section>
							</Form>
							{/* Handle errors */}
							{hasError ? <div className='p-2 px-3 text-danger'>{errors.firstName}</div> : null}
						</>
					)
				}}
			</Formik>
		</div>
	)
}
