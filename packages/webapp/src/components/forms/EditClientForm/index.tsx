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
import { useContacts } from '~hooks/api/useContacts'
import { Contact, ContactInput, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { memo, useState } from 'react'
import TagSelect from '~ui/TagSelect'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import FormikRadioGroup from '~ui/FormikRadioGroup'
import ArchiveClientModal from '~ui/ArchiveClientModal'
import CLIENT_DEMOGRAPHICS from '~utils/consts/CLIENT_DEMOGRAPHICS'
import { DatePicker } from '@fluentui/react'
import { useLocale } from '~hooks/useLocale'

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
	const { t, c } = useTranslation('clients')
	const formTitle = title || t('editClientTitle')
	const { updateContact, archiveContact } = useContacts()
	const { orgId } = useCurrentUser()
	const [locale] = useLocale()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)
	const lastPreferredLanguageOption =
		CLIENT_DEMOGRAPHICS.preferredLanguage.options[
			CLIENT_DEMOGRAPHICS.preferredLanguage.options.length - 1
		]
	const lastRaceOption =
		CLIENT_DEMOGRAPHICS.race.options[CLIENT_DEMOGRAPHICS.race.options.length - 1]
	const lastEthnicityOption =
		CLIENT_DEMOGRAPHICS.ethnicity.options[CLIENT_DEMOGRAPHICS.ethnicity.options.length - 1]
	const lastGenderOption =
		CLIENT_DEMOGRAPHICS.gender.options[CLIENT_DEMOGRAPHICS.gender.options.length - 1]

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
				county: values.county,
				state: values.state,
				zip: values.zip
			},
			demographics: {
				race: values.race,
				raceOther: values.race === lastRaceOption.key ? values.raceCustom : '',
				gender: values.gender,
				ethnicity: values.ethnicity,
				preferredLanguage: values.preferredLanguage,
				preferredContactTime: values.preferredContactTime,
				preferredContactMethod: values.preferredContactMethod,
				preferredLanguageOther:
					values.preferredLanguage === lastPreferredLanguageOption.key
						? values.preferredLanguageCustom
						: '',
				genderOther: values.gender === lastGenderOption.key ? values.genderCustom : '',
				ethnicityOther: values.ethnicity === lastEthnicityOption.key ? values.ethnicityCustom : ''
			},
			tags: values?.tags ? values.tags.map((a) => a.value) : undefined
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

	const handleArchiveClient = async (clientId) => {
		await archiveContact(clientId)
		setShowModal(false)
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
					county: contact?.address?.county || '',
					state: contact?.address?.state || '',
					zip: contact?.address?.zip || '',
					race: contact?.demographics?.race || '',
					raceCustom: contact?.demographics?.raceOther || '',
					gender: contact?.demographics?.gender || '',
					genderCustom: contact?.demographics?.genderOther || '',
					ethnicity: contact?.demographics?.ethnicity || '',
					ethnicityCustom: contact?.demographics?.ethnicityOther || '',
					preferredLanguage: contact?.demographics?.preferredLanguage || '',
					preferredLanguageCustom: contact?.demographics?.preferredLanguageOther || '',
					preferredContactMethod: contact?.demographics?.preferredContactMethod || '',
					preferredContactTime: contact?.demographics?.preferredContactTime || '',
					tags: contact?.tags?.map((t) => {
						return {
							label: t.label,
							value: t.id
						}
					})
				}}
				validationSchema={UpdateClientValidationSchema}
				onSubmit={(values) => {
					handleUpdateContact(values)
				}}
			>
				{({ errors, values, setFieldValue }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
							<FormSectionTitle className='mt-5'>
								{t('editClient.fields.personalInfo')}
							</FormSectionTitle>
							<Row>
								<Col>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='firstName'
										placeholder={t('editClient.fields.firstNamePlaceholder')}
										className={cx(styles.field)}
										error={errors.firstName}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
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
									<DatePicker
										placeholder={t('editClient.fields.dateOfBirthPlaceholder')}
										allowTextInput
										showMonthPickerAsOverlay={false}
										ariaLabel={c('formElements.datePickerAriaLabel')}
										value={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
										onSelectDate={(date) => {
											setFieldValue('dateOfBirth', date)
										}}
										formatDate={(date) => date.toLocaleDateString(locale)}
										maxDate={new Date()}
										styles={{
											root: {
												border: 0
											},
											wrapper: {
												border: 0
											},
											textField: {
												border: '1px solid var(--bs-gray-4)',
												borderRadius: '3px',
												minHeight: '35px',
												//paddingTop: 4,
												selectors: {
													'.ms-TextField-fieldGroup': {
														border: 0,
														':after': {
															outline: 0,
															border: 0
														}
													},
													span: {
														div: {
															marginTop: 0
														}
													}
												},
												':focus': {
													borderColor: 'var(--bs-primary-light)'
												},
												':active': {
													borderColor: 'var(--bs-primary-light)'
												},
												':hover': {
													borderColor: 'var(--bs-primary-light)'
												}
											}
										}}
										className={cx(styles.field)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('editClient.fields.addContactInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='email'
										placeholder={t('editClient.fields.emailPlaceholder')}
										className={cx(styles.field)}
										error={errors.email}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
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
										disabled={contact?.status === ContactStatus.Archived}
										name='street'
										placeholder={t('editClient.fields.streetPlaceholder')}
										className={cx(styles.field)}
										error={errors.street}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='unit'
										placeholder={t('editClient.fields.unitPlaceholder')}
										className={cx(styles.field)}
										error={errors.unit}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col md={4}>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='city'
										placeholder={t('editClient.fields.cityPlaceholder')}
										className={cx(styles.field)}
										error={errors.city}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='state'
										placeholder={t('editClient.fields.statePlaceHolder')}
										className={cx(styles.field)}
										error={errors.state}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='zip'
										placeholder={t('editClient.fields.zipCodePlaceholder')}
										className={cx(styles.field)}
										error={errors.zip}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										disabled={contact?.status === ContactStatus.Archived}
										name='county'
										placeholder={t('editClient.fields.countyPlaceholder')}
										className={cx(styles.field)}
										error={errors.county}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>{t('editClient.fields.tags')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<TagSelect
										disabled={contact?.status === ContactStatus.Archived}
										name='tags'
										placeholder={t('editClient.fields.addTagsPlaceholder')}
									/>
								</Col>
							</Row>

							{/* Demographics */}
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										disabled={contact?.status === ContactStatus.Archived}
										name='gender'
										label={t(`demographics.gender.label`)}
										options={CLIENT_DEMOGRAPHICS.gender.options.map((o) => ({
											key: o.key,
											text: t(`demographics.gender.options.${o.key}`)
										}))}
										customOptionInput
										customOptionPlaceholder={t(`demographics.gender.customOptionPlaceholder`)}
									/>
								</Col>
								<Col>
									<FormikRadioGroup
										disabled={contact?.status === ContactStatus.Archived}
										name='ethnicity'
										label={t(`demographics.ethnicity.label`)}
										options={CLIENT_DEMOGRAPHICS.ethnicity.options.map((o) => ({
											key: o.key,
											text: t(`demographics.ethnicity.options.${o.key}`)
										}))}
										customOptionInput
										customOptionPlaceholder={t(`demographics.ethnicity.customOptionPlaceholder`)}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										disabled={contact?.status === ContactStatus.Archived}
										name='race'
										label={t(`demographics.race.label`)}
										options={CLIENT_DEMOGRAPHICS.race.options.map((o) => ({
											key: o.key,
											text: t(`demographics.race.options.${o.key}`)
										}))}
										customOptionInput
										customOptionPlaceholder={t(`demographics.race.customOptionPlaceholder`)}
									/>
								</Col>
								<Col>
									<FormikRadioGroup
										disabled={contact?.status === ContactStatus.Archived}
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
										disabled={contact?.status === ContactStatus.Archived}
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
										disabled={contact?.status === ContactStatus.Archived}
										name='preferredContactTime'
										label={t(`demographics.preferredContactTime.label`)}
										options={CLIENT_DEMOGRAPHICS.preferredContactTime.options.map((o) => ({
											key: o.key,
											text: t(`demographics.preferredContactTime.options.${o.key}`)
										}))}
									/>
								</Col>
							</Row>
							<FormikSubmitButton disabled={contact?.status === ContactStatus.Archived}>
								{t('editClient.buttons.save')}
							</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									{t('editClient.submitMessage.failed')}
								</div>
							)}
							{/* Archive user */}
							<div className='mt-5'>
								<ArchiveClientModal
									showModal={showModal}
									client={contact}
									onSubmit={() => handleArchiveClient(contact.id)}
								/>
								<h3 className='mb-3'>{t('editClient.buttons.dangerWarning')}</h3>
								<FormikButton
									type='button'
									disabled={contact?.status === ContactStatus.Archived}
									className={cx(styles.deleteButton, 'btn btn-danger')}
									onClick={() => setShowModal(true)}
								>
									{t('editClient.buttons.archive')}
								</FormikButton>
								<div className='mt-3 alert alert-danger'>
									{t('editClient.buttons.archiveWarning')}
								</div>
							</div>
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
export default wrap(EditClientForm)
