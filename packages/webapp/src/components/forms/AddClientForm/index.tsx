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
import FormikRadioGroup from '~ui/FormikRadioGroup'
import { useContacts } from '~hooks/api/useContacts'
import { ContactInput } from '@cbosuite/schema/dist/client-types'
import { memo, useState } from 'react'
import FormikDatePicker from '~components/ui/FormikDatePicker'
import TagSelect from '~ui/TagSelect'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import CLIENT_DEMOGRAPHICS from '~utils/consts/CLIENT_DEMOGRAPHICS'

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
	const formTitle = title || t('addClientTitle')
	const { createContact } = useContacts()
	const { orgId } = useCurrentUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const lastPreferredLanguage =
		CLIENT_DEMOGRAPHICS.preferredLanguage.options[
			CLIENT_DEMOGRAPHICS.preferredLanguage.options.length - 1
		]

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

	const handleCreateContact = async (values) => {
		const newContact: ContactInput = {
			orgId: orgId,
			first: values.firstName,
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
			demographics: {
				race: values.race,
				gender: values.gender,
				ethnicity: values.ethnicity,
				preferredLanguage: values.preferredLanguage,
				preferredContactTime: values.preferredContactTime,
				preferredContactMethod: values.preferredContactMethod,
				preferredLanguageOther:
					values.preferredLanguage === lastPreferredLanguage.key
						? values.preferredLanguageCustom
						: ''
			},
			tags: values?.tags ? values.tags.map((a) => a.value) : undefined
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
					lastName: '',
					dateOfBirth: '',
					email: '',
					phone: '',
					street: '',
					unit: '',
					city: '',
					state: '',
					zip: '',
					tags: [],
					gender: '',
					ethnicity: '',
					race: '',
					preferredLanguage: '',
					preferredLanguageCustom: '',
					preferredContactMethod: '',
					preferredContactTime: ''
				}}
				validationSchema={NewClientValidationSchema}
				onSubmit={(values) => {
					handleCreateContact(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormTitle>
								{!values.firstName || !values.lastName
									? formTitle
									: `${values.firstName} ${values.lastName}`}
							</FormTitle>
							<FormSectionTitle className='mt-5'>
								{t('addClient.fields.personalInfo')}
							</FormSectionTitle>
							<Row>
								<Col>
									<FormikField
										name='firstName'
										placeholder={t('addClient.fields.firstNamePlaceholder')}
										className={cx(styles.field)}
										error={errors.firstName}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										name='lastName'
										placeholder={t('addClient.fields.lastNamePlaceholder')}
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
										placeholder={t('addClient.fields.dateOfBirthPlaceholder')}
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
										placeholder={t('addClient.fields.emailPlaceholder')}
										className={cx(styles.field)}
										error={errors.email}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										name='phone'
										placeholder={t('addClient.fields.phonePlaceholder')}
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
										placeholder={t('addClient.fields.streetPlaceholder')}
										className={cx(styles.field)}
										error={errors.street}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='unit'
										placeholder={t('addClient.fields.unitPlaceholder')}
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
										placeholder={t('addClient.fields.cityPlaceholder')}
										className={cx(styles.field)}
										error={errors.city}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='state'
										placeholder={t('addClient.fields.statePlaceHolder')}
										className={cx(styles.field)}
										error={errors.state}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='zip'
										placeholder={t('addClient.fields.zipCodePlaceholder')}
										className={cx(styles.field)}
										error={errors.zip}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('addClient.fields.tags')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<TagSelect name='tags' placeholder={t('addClient.fields.addTagsPlaceholder')} />
								</Col>
							</Row>
							{/* Demographics */}
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										name='gender'
										label={t(`demographics.gender.label`)}
										options={CLIENT_DEMOGRAPHICS.gender.options.map((o) => ({
											key: o.key,
											text: t(`demographics.gender.options.${o.key}`)
										}))}
									/>
								</Col>
								<Col>
									<FormikRadioGroup
										name='ethnicity'
										label={t(`demographics.ethnicity.label`)}
										options={CLIENT_DEMOGRAPHICS.ethnicity.options.map((o) => ({
											key: o.key,
											text: t(`demographics.ethnicity.options.${o.key}`)
										}))}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										name='race'
										label={t(`demographics.race.label`)}
										options={CLIENT_DEMOGRAPHICS.race.options.map((o) => ({
											key: o.key,
											text: t(`demographics.race.options.${o.key}`)
										}))}
									/>
								</Col>
								<Col>
									<FormikRadioGroup
										name='preferredLanguage'
										label={t(`demographics.preferredLanguage.label`)}
										options={CLIENT_DEMOGRAPHICS.preferredLanguage.options.map((o) => ({
											key: o.key,
											text: t(`demographics.preferredLanguage.options.${o.key}`)
										}))}
										customOptionInput
										customOptionPlaceholder={t(
											`demographics.preferredLanguage.customOptionPlaceholder`
										)}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										name='preferredContactMethod'
										label={t(`demographics.preferredContactMethod.label`)}
										options={CLIENT_DEMOGRAPHICS.preferredContactMethod.options.map((o) => ({
											key: o.key,
											text: t(`demographics.preferredContactMethod.options.${o.key}`)
										}))}
									/>
								</Col>
								<Col>
									<FormikRadioGroup
										name='preferredContactTime'
										label={t(`demographics.preferredContactTime.label`)}
										options={CLIENT_DEMOGRAPHICS.preferredContactTime.options.map((o) => ({
											key: o.key,
											text: t(`demographics.preferredContactTime.options.${o.key}`)
										}))}
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

export default wrap(AddClientForm)
