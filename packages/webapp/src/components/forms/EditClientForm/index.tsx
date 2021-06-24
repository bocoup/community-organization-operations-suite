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
import { Contact, ContactInput } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from '~hooks/api/useAuth'
import { memo, useState } from 'react'
import FormikDatePicker from '~components/ui/FormikDatePicker'
import AttributeSelect from '~ui/AttributeSelect'

interface EditClientFormProps extends ComponentProps {
	title?: string
	contact: Contact
	closeForm?: () => void
}

const UpdateClientValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	lastName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required')
})

const EditClientForm = memo(function EditClientForm({
	title,
	className,
	contact,
	closeForm
}: EditClientFormProps): JSX.Element {
	const formTitle = title || 'Edit Client'
	const { updateContact } = useContacts()
	const { authUser } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const handleUpdateContact = async values => {
		const editContact: ContactInput = {
			id: contact.id,
			orgId: orgId,
			first: values.firstName,
			middle: values.middleInitial,
			last: values.lastName,
			dateOfBirth: values?.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : '',
			email: values.email,
			phone: values.phone,
			address: {
				street: values.street,
				unit: values.unit,
				city: values.city,
				state: values.state,
				zip: values.zip
			},
			attributes: values?.attributes ? values.attributes.map(a => a.value) : undefined
		}

		const response = await updateContact(editContact)

		if (response.status === 'success') {
			setSubmitMessage(null)
			closeForm?.()
		} else {
			setSubmitMessage(response.message)
		}

		closeForm?.()
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: contact.name.first,
					middleInitial: contact.name?.middle || '',
					lastName: contact.name.last,
					dateOfBirth: contact?.dateOfBirth ? new Date(contact.dateOfBirth) : '',
					email: contact?.email || '',
					phone: contact?.phone || '',
					street: contact?.address?.street || '',
					unit: contact?.address?.unit || '',
					city: contact?.address?.city || '',
					state: contact?.address?.state || '',
					zip: contact?.address?.zip || '',
					attributes: contact?.attributes?.map(attribute => {
						return {
							label: attribute.label,
							value: attribute.id
						}
					})
				}}
				validationSchema={UpdateClientValidationSchema}
				onSubmit={values => {
					handleUpdateContact(values)
				}}
			>
				{({ errors }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
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
							<FormSectionTitle>Attributes</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<AttributeSelect name='attributes' placeholder='Add attributes...' />
								</Col>
							</Row>
							<FormikSubmitButton>Save</FormikSubmitButton>
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
})
export default EditClientForm