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
import { useContacts } from '~hooks/api/useContacts'
import { ContactInput } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from '~hooks/api/useAuth'
import { useState } from 'react'
import FormikDatePicker from '~components/ui/FormikDatePicker'

interface AddClientFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const NewClientValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	lastName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required')
})

export default function AddClientForm({
	title,
	className,
	closeForm
}: AddClientFormProps): JSX.Element {
	const formTitle = title || 'Add Client'
	const { createContact } = useContacts()
	const { authUser } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const handleCreateContact = async values => {
		const newContact: ContactInput = {
			orgId: orgId,
			first: values.firstName,
			middle: values.middleInital,
			last: values.lastName,
			dateOfBirth: values?.dateOfBirth
				? new Intl.DateTimeFormat('en-US').format(values.dateOfBirth)
				: '',
			email: values.email,
			phone: values.phone,
			address: {
				street: values.street,
				unit: values.unit,
				city: values.city,
				state: values.state,
				zip: values.zip
			}
		}

		const response = await createContact(newContact)

		if (response.status === 'success') {
			setSubmitMessage(null)
			closeForm?.()
		} else {
			setSubmitMessage(response.message)
		}
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: '',
					middleInitial: '',
					lastName: '',
					dateOfBirth: '',
					email: '',
					phone: '',
					street: '',
					unit: '',
					city: '',
					state: '',
					zip: ''
				}}
				validationSchema={NewClientValidationSchema}
				onSubmit={values => {
					handleCreateContact(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormTitle>
								{!values.firstName || !values.lastName
									? formTitle
									: `${values.firstName} ${values.middleInitial ?? ''} ${values.lastName}`}
							</FormTitle>
							<FormSectionTitle className='mt-5'>Personal info</FormSectionTitle>
							<Row>
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
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikDatePicker
										name='dateOfBirth'
										placeholder='Date of Birth'
										className={cx(styles.field)}
										maxDate={new Date()}
										error={errors.dateOfBirth}
										errorClassName={cx(styles.errorLabel)}
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
							<FormikSubmitButton>Create Client</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									Submit Failed: {submitMessage}, review and update fields or edit the existing
									account.
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
}
