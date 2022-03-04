/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { last as _last } from 'lodash'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import styles from './index.module.scss'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormTitle } from '~components/ui/FormTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import { FormikButton } from '~components/ui/FormikButton'
import type { StandardFC } from '~types/StandardFC'
import { FormikField } from '~ui/FormikField'
import { useContacts } from '~hooks/api/useContacts'
import { Contact, ContactInput, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { useState } from 'react'
import { TagSelect } from '~ui/TagSelect'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { FormikRadioGroup } from '~ui/FormikRadioGroup'
import { ArchiveClientModal } from '~ui/ArchiveClientModal'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { IDatePickerStyles, DatePicker } from '@fluentui/react'
import { useLocale } from '~hooks/useLocale'
import { emptyStr, noop } from '~utils/noop'
import { StatusType } from '~hooks/api'

interface EditClientFormProps {
	title?: string
	contact: Contact
	closeForm?: () => void
}

const lastPreferredLanguageOption = _last(CLIENT_DEMOGRAPHICS.preferredLanguage.options)
const lastRaceOption = _last(CLIENT_DEMOGRAPHICS.race.options)
const lastEthnicityOption = _last(CLIENT_DEMOGRAPHICS.ethnicity.options)
const lastGenderOption = _last(CLIENT_DEMOGRAPHICS.gender.options)

export const EditClientForm: StandardFC<EditClientFormProps> = wrap(function EditClientForm({
	title,
	className,
	contact,
	closeForm = noop
}) {
	const { t, c } = useTranslation(Namespace.Clients)
	const formTitle = title || t('editClientTitle')
	const { updateContact, archiveContact } = useContacts()
	const { orgId } = useCurrentUser()
	const [locale] = useLocale()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const [showModal, setShowModal] = useState(false)

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
			tags: values?.tags ? values.tags.map((a) => a.value) : undefined,
			notes: values?.notes
		}

		const response = await updateContact(editContact)

		if (response.status === StatusType.Success) {
			setSubmitMessage(null)
			closeForm()
		} else {
			setSubmitMessage(response.message)
		}

		closeForm()
	}

	const handleArchiveClient = async (clientId) => {
		await archiveContact(clientId)
		setShowModal(false)
		closeForm()
	}

	const isArchived: boolean = contact?.status === ContactStatus.Archived

	return (
		<div className={className}>
			<Formik
				validateOnBlur
				initialValues={{
					firstName: contact.name.first,
					lastName: contact.name.last,
					dateOfBirth: contact?.dateOfBirth ? new Date(contact.dateOfBirth) : '',
					email: contact?.email || emptyStr,
					phone: contact?.phone || emptyStr,
					street: contact?.address?.street || emptyStr,
					unit: contact?.address?.unit || emptyStr,
					city: contact?.address?.city || emptyStr,
					county: contact?.address?.county || emptyStr,
					state: contact?.address?.state || emptyStr,
					zip: contact?.address?.zip || emptyStr,
					notes: contact?.notes || emptyStr,
					race: contact?.demographics?.race || emptyStr,
					raceCustom: contact?.demographics?.raceOther || emptyStr,
					gender: contact?.demographics?.gender || emptyStr,
					genderCustom: contact?.demographics?.genderOther || emptyStr,
					ethnicity: contact?.demographics?.ethnicity || emptyStr,
					ethnicityCustom: contact?.demographics?.ethnicityOther || emptyStr,
					preferredLanguage: contact?.demographics?.preferredLanguage || emptyStr,
					preferredLanguageCustom: contact?.demographics?.preferredLanguageOther || emptyStr,
					preferredContactMethod: contact?.demographics?.preferredContactMethod || emptyStr,
					preferredContactTime: contact?.demographics?.preferredContactTime || emptyStr,
					tags: contact?.tags?.map((t) => ({
						label: t.label,
						value: t.id
					}))
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
										autoComplete='off'
										disabled={isArchived}
										name='firstName'
										placeholder={t('editClient.fields.firstNamePlaceholder')}
										className={styles.field}
										error={errors.firstName}
										errorClassName={styles.errorLabel}
									/>
									<FormikField
										autoComplete='off'
										disabled={isArchived}
										name='lastName'
										placeholder={t('editClient.fields.lastNamePlaceholder')}
										className={styles.field}
										error={errors.lastName}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col>
									<DatePicker
										disabled={isArchived}
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
										styles={DatePickerStyles}
										className={styles.field}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('editClient.fields.addContactInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										autoComplete='off'
										disabled={isArchived}
										name='email'
										placeholder={t('editClient.fields.emailPlaceholder')}
										className={styles.field}
										error={errors.email}
										errorClassName={styles.errorLabel}
									/>
									<FormikField
										autoComplete='off'
										disabled={isArchived}
										name='phone'
										placeholder={t('editClient.fields.phonePlaceholder')}
										className={styles.field}
										error={errors.phone as string}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('editClient.fields.address')}</FormSectionTitle>
							<Row>
								<Col md={8}>
									<FormikField
										autoComplete='off'
										disabled={isArchived}
										name='street'
										placeholder={t('editClient.fields.streetPlaceholder')}
										className={styles.field}
										error={errors.street}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										autoComplete='off'
										disabled={isArchived}
										name='unit'
										placeholder={t('editClient.fields.unitPlaceholder')}
										className={styles.field}
										error={errors.unit}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col md={4}>
									<FormikField
										disabled={isArchived}
										name='city'
										placeholder={t('editClient.fields.cityPlaceholder')}
										className={styles.field}
										error={errors.city}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										disabled={isArchived}
										name='state'
										placeholder={t('editClient.fields.statePlaceHolder')}
										className={styles.field}
										error={errors.state}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										disabled={isArchived}
										name='zip'
										placeholder={t('editClient.fields.zipCodePlaceholder')}
										className={styles.field}
										error={errors.zip}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										disabled={isArchived}
										name='county'
										placeholder={t('editClient.fields.countyPlaceholder')}
										className={styles.field}
										error={errors.county}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('editClient.fields.tags')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<TagSelect
										disabled={isArchived}
										name='tags'
										placeholder={t('editClient.fields.addTagsPlaceholder')}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('editClient.fields.notes')}</FormSectionTitle>
							<FormikField
								as='textarea'
								autoComplete='off'
								name='notes'
								disabled={isArchived}
								placeholder={t('editClient.fields.notesPlaceholder')}
								className={styles.field}
								error={errors.notes}
								errorClassName={styles.errorLabel}
							/>

							{/* Demographics */}
							<Row className='mb-4 pb-2 flex-col flex-md-row'>
								<Col>
									<FormikRadioGroup
										disabled={isArchived}
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
										disabled={isArchived}
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
										disabled={isArchived}
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
										disabled={isArchived}
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
										disabled={isArchived}
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
										disabled={isArchived}
										name='preferredContactTime'
										label={t(`demographics.preferredContactTime.label`)}
										options={CLIENT_DEMOGRAPHICS.preferredContactTime.options.map((o) => ({
											key: o.key,
											text: t(`demographics.preferredContactTime.options.${o.key}`)
										}))}
									/>
								</Col>
							</Row>

							<FormikSubmitButton disabled={isArchived}>
								{t('editClient.buttons.save')}
							</FormikSubmitButton>
							{submitMessage && (
								<div className='mt-5 alert alert-danger'>
									{t('editClient.submitMessage.failed')}
								</div>
							)}

							{/* Archive user */}
							{!isArchived && (
								<div className='mt-5'>
									<ArchiveClientModal
										showModal={showModal}
										client={contact}
										onSubmit={() => handleArchiveClient(contact.id)}
									/>
									<h3 className='mb-3'>{t('editClient.buttons.dangerWarning')}</h3>
									<FormikButton
										type='button'
										className={cx(styles.deleteButton, 'btn btn-danger')}
										onClick={() => setShowModal(true)}
									>
										{t('editClient.buttons.archive')}
									</FormikButton>
									<div className='mt-3 alert alert-danger'>
										{t('editClient.buttons.archiveWarning')}
									</div>
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})

const DatePickerStyles: Partial<IDatePickerStyles> = {
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
}
