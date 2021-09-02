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
import { Contact, ContactInput } from '@cbosuite/schema/dist/client-types'
import { memo, useState } from 'react'
import FormikDatePicker from '~components/ui/FormikDatePicker'
import AttributeSelect from '~ui/AttributeSelect'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'

interface EditClientFormProps extends ComponentProps {
	title?: string
	contact: Contact
	closeForm?: () => void
}

const EditClientForm = memo(function EditClientForm({
	title,
	className,
	contact,
	closeForm
}: EditClientFormProps): JSX.Element {
	const { t } = useTranslation('clients')
	const formTitle = title || t('editClientTitle')
	const { updateContact } = useContacts()
	const { orgId } = useCurrentUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const UpdateClientValidationSchema = yup.object().shape({
		firstName: yup
			.string()
			.min(2, t('editClient.yup.tooShort'))
			.max(25, t('editClient.yup.tooLong'))
			.required(t('editClient.yup.required')),
		lastName: yup
			.string()
			.min(2, t('editClient.yup.tooShort'))
			.max(25, t('editClient.yup.tooLong'))
			.required(t('editClient.yup.required'))
	})

	const handleUpdateContact = async (values) => {
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
			attributes: values?.attributes ? values.attributes.map((a) => a.value) : undefined
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
					lastName: contact.name.last,
					dateOfBirth: contact?.dateOfBirth ? new Date(contact.dateOfBirth) : '',
					email: contact?.email || '',
					phone: contact?.phone || '',
					street: contact?.address?.street || '',
					unit: contact?.address?.unit || '',
					city: contact?.address?.city || '',
					state: contact?.address?.state || '',
					zip: contact?.address?.zip || '',
					attributes: contact?.attributes?.map((attribute) => {
						return {
							label: attribute.label,
							value: attribute.id
						}
					})
				}}
				validationSchema={UpdateClientValidationSchema}
				onSubmit={(values) => {
					handleUpdateContact(values)
				}}
			>
				{({ errors }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
							<FormSectionTitle className='mt-5'>
								{t('editClient.fields.personalInfo')}
							</FormSectionTitle>
							<Row>
								<Col>
									<FormikField
										name='firstName'
										placeholder={t('editClient.fields.firstNamePlaceholder')}
										className={cx(styles.field)}
										error={errors.firstName}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										name='lastName'
										placeholder={t('editClient.fields.lastNamePlaceholder')}
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
										placeholder={t('editClient.fields.dateOfBirthPlaceholder')}
										className={cx(styles.field)}
										maxDate={new Date()}
										error={errors.dateOfBirth}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('editClient.fields.addContactInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='email'
										placeholder={t('editClient.fields.emailPlaceholder')}
										className={cx(styles.field)}
										error={errors.email}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										name='phone'
										placeholder={t('editClient.fields.phonePlaceholder')}
										className={cx(styles.field)}
										error={errors.phone as string}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('editClient.fields.address')}</FormSectionTitle>
							<Row>
								<Col md={8}>
									<FormikField
										name='street'
										placeholder={t('editClient.fields.streetPlaceholder')}
										className={cx(styles.field)}
										error={errors.street}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='unit'
										placeholder={t('editClient.fields.unitPlaceholder')}
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
										placeholder={t('editClient.fields.cityPlaceholder')}
										className={cx(styles.field)}
										error={errors.city}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='state'
										placeholder={t('editClient.fields.statePlaceHolder')}
										className={cx(styles.field)}
										error={errors.state}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='zip'
										placeholder={t('editClient.fields.zipCodePlaceholder')}
										className={cx(styles.field)}
										error={errors.zip}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('editClient.fields.attributes')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<AttributeSelect
										name='attributes'
										placeholder={t('editClient.fields.addAttributesPlaceholder')}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>{t('editClient.buttons.save')}</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									{t('editClient.submitMessage.failed')}
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
export default wrap(EditClientForm)
