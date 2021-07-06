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
import { memo, useState } from 'react'
import FormikDatePicker from '~components/ui/FormikDatePicker'
import AttributeSelect from '~ui/AttributeSelect'
import { useTranslation } from '~hooks/useTranslation'

interface AddClientFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const AddClientForm = memo(function AddClientForm({
	title,
	className,
	closeForm
}: AddClientFormProps): JSX.Element {
	const { t } = useTranslation('clients')
	const formTitle = title || t('addClient.title')
	const { createContact } = useContacts()
	const { authUser } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const NewClientValidationSchema = yup.object().shape({
		firstName: yup
			.string()
			.min(2, t('addClient.yup.tooShort'))
			.max(25, t('addClient.yup.tooLong'))
			.required(t('addClient.yup.required')),
		lastName: yup
			.string()
			.min(2, t('addClient.yup.tooShort'))
			.max(25, t('addClient.yup.tooLong'))
			.required(t('addClient.yup.required'))
	})

	const handleCreateContact = async values => {
		const newContact: ContactInput = {
			orgId: orgId,
			first: values.firstName,
			middle: values.middleInital,
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
					zip: '',
					attributes: []
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
							<FormSectionTitle className='mt-5'>
								{t('addClient.fields.personalInfo')}
							</FormSectionTitle>
							<Row>
								<Col md={5}>
									<FormikField
										name='firstName'
										placeholder={t('addClient.fields.firstName.placeholder')}
										className={cx(styles.field)}
										error={errors.firstName}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='middleInitial'
										placeholder={t('addClient.fields.middle.placeholder')}
										className={cx(styles.field)}
										error={errors.middleInitial}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={5}>
									<FormikField
										name='lastName'
										placeholder={t('addClient.fields.lastName.placeholder')}
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
										placeholder={t('addClient.fields.dateOfBirth.placeholder')}
										className={cx(styles.field)}
										maxDate={new Date()}
										error={errors.dateOfBirth}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('addClient.fields.addContactInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='email'
										placeholder={t('addClient.fields.email.placeholder')}
										className={cx(styles.field)}
										error={errors.email}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										name='phone'
										placeholder={t('addClient.fields.phone.placeholder')}
										className={cx(styles.field)}
										error={errors.phone as string}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('addClient.fields.address')}</FormSectionTitle>
							<Row>
								<Col md={8}>
									<FormikField
										name='street'
										placeholder={t('addClient.fields.street.placeholder')}
										className={cx(styles.field)}
										error={errors.street}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='unit'
										placeholder={t('addClient.fields.unit.placeholder')}
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
										placeholder={t('addClient.fields.city.placeholder')}
										className={cx(styles.field)}
										error={errors.city}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='state'
										placeholder={t('addClient.fields.state.placeholder')}
										className={cx(styles.field)}
										error={errors.state}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='zip'
										placeholder={t('addClient.fields.zipCode.placeholder')}
										className={cx(styles.field)}
										error={errors.zip}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('addClient.fields.attributes')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<AttributeSelect
										name='attributes'
										placeholder={t('addClient.fields.addAttributes.placeholder')}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>{t('addClient.buttons.createClient')}</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									{t('addClient.submitMessage.failed')}
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})

export default AddClientForm
