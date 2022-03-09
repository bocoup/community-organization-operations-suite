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
import type { StandardFC } from '~types/StandardFC'
import { FormikField } from '~ui/FormikField'
import { FormikRadioGroup } from '~ui/FormikRadioGroup'
import { useContacts } from '~hooks/api/useContacts'
import type { ContactInput } from '@cbosuite/schema/dist/client-types'
import { useState } from 'react'
import { TagSelect } from '~ui/TagSelect'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap, trackEvent } from '~utils/appinsights'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import type { IDatePickerStyles } from '@fluentui/react'
import { DatePicker } from '@fluentui/react'
import { useLocale } from '~hooks/useLocale'
import { emptyStr, noop } from '~utils/noop'
import { StatusType } from '~hooks/api'

interface AddClientFormProps {
	title?: string
	closeForm?: () => void
}

const lastPreferredLanguageOption = _last(CLIENT_DEMOGRAPHICS.preferredLanguage.options)
const lastRaceOption = _last(CLIENT_DEMOGRAPHICS.race.options)
const lastEthnicityOption = _last(CLIENT_DEMOGRAPHICS.ethnicity.options)
const lastGenderOption = _last(CLIENT_DEMOGRAPHICS.gender.options)

export const AddClientForm: StandardFC<AddClientFormProps> = wrap(function AddClientForm({
	title,
	className,
	closeForm = noop
}) {
	const { t, c } = useTranslation(Namespace.Clients)
	const formTitle = title || t('addClientTitle')
	const [locale] = useLocale()
	const { createContact } = useContacts()
	const { orgId } = useCurrentUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)
	const [isSubmitButtonDisabled, setSubmitButtonDisabledState] = useState<boolean>(false)

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
		setSubmitButtonDisabledState(true)
		const newContact: ContactInput = {
			orgId: orgId,
			first: values.firstName,
			last: values.lastName,
			dateOfBirth: values?.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : emptyStr,
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
				raceOther: values.race === lastRaceOption.key ? values.raceCustom : emptyStr,
				gender: values.gender,
				ethnicity: values.ethnicity,
				preferredLanguage: values.preferredLanguage,
				preferredContactTime: values.preferredContactTime,
				preferredContactMethod: values.preferredContactMethod,
				preferredLanguageOther:
					values.preferredLanguage === lastPreferredLanguageOption.key
						? values.preferredLanguageCustom
						: emptyStr,
				genderOther: values.gender === lastGenderOption.key ? values.genderCustom : emptyStr,
				ethnicityOther:
					values.ethnicity === lastEthnicityOption.key ? values.ethnicityCustom : emptyStr
			},
			tags: values?.tags ? values.tags.map((a) => a.value) : undefined,
			notes: values?.notes
		}

		const response = await createContact(newContact)

		if (response.status === StatusType.Success) {
			setSubmitMessage(null)

			if (newContact?.tags) {
				newContact.tags.forEach((tag) => {
					trackEvent({
						name: 'Tag Applied',
						properties: {
							'Organization ID': newContact.orgId,
							'Tag ID': tag,
							'Used On': 'client'
						}
					})
				})
			}

			closeForm()
		} else {
			setSubmitMessage(response.message)
			setSubmitButtonDisabledState(false)
		}
	}

	return (
		<div className={cx(className, 'addClientForm')}>
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
					county: '',
					state: '',
					zip: '',
					tags: [],
					notes: '',
					gender: '',
					genderCustom: '',
					ethnicity: '',
					ethnicityCustom: '',
					race: '',
					raceCustom: '',
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
				{({ values, errors, setFieldValue }) => {
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
										autoComplete='off'
										name='firstName'
										placeholder={t('addClient.fields.firstNamePlaceholder')}
										className={styles.field}
										error={errors.firstName}
										errorClassName={styles.errorLabel}
									/>
									<FormikField
										autoComplete='off'
										name='lastName'
										placeholder={t('addClient.fields.lastNamePlaceholder')}
										className={styles.field}
										error={errors.lastName}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col>
									<DatePicker
										placeholder={t('addClient.fields.dateOfBirthPlaceholder')}
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

							<FormSectionTitle>{t('addClient.fields.addContactInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										autoComplete='off'
										name='email'
										placeholder={t('addClient.fields.emailPlaceholder')}
										className={styles.field}
										error={errors.email}
										errorClassName={styles.errorLabel}
									/>
									<FormikField
										autoComplete='off'
										name='phone'
										placeholder={t('addClient.fields.phonePlaceholder')}
										className={styles.field}
										error={errors.phone as string}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('addClient.fields.address')}</FormSectionTitle>
							<Row>
								<Col md={8}>
									<FormikField
										autoComplete='off'
										name='street'
										placeholder={t('addClient.fields.streetPlaceholder')}
										className={styles.field}
										error={errors.street}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										autoComplete='off'
										name='unit'
										placeholder={t('addClient.fields.unitPlaceholder')}
										className={styles.field}
										error={errors.unit}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col md={4}>
									<FormikField
										name='city'
										placeholder={t('addClient.fields.cityPlaceholder')}
										className={styles.field}
										error={errors.city}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='state'
										placeholder={t('addClient.fields.statePlaceHolder')}
										className={styles.field}
										error={errors.state}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={2}>
									<FormikField
										name='zip'
										placeholder={t('addClient.fields.zipCodePlaceholder')}
										className={styles.field}
										error={errors.zip}
										errorClassName={styles.errorLabel}
									/>
								</Col>
								<Col md={4}>
									<FormikField
										name='county'
										placeholder={t('addClient.fields.countyPlaceholder')}
										className={styles.field}
										error={errors.county}
										errorClassName={styles.errorLabel}
									/>
								</Col>
							</Row>

							<FormSectionTitle>{t('addClient.fields.tags')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<TagSelect name='tags' placeholder={t('addClient.fields.addTagsPlaceholder')} />
								</Col>
							</Row>

							<FormSectionTitle>{t('addClient.fields.notes')}</FormSectionTitle>
							<FormikField
								as='textarea'
								autoComplete='off'
								name='notes'
								placeholder={t('addClient.fields.notesPlaceholder')}
								className={styles.field}
								error={errors.notes}
								errorClassName={styles.errorLabel}
							/>

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
										customOptionInput
										customOptionPlaceholder={t(`demographics.gender.customOptionPlaceholder`)}
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
										customOptionInput
										customOptionPlaceholder={t(`demographics.ethnicity.customOptionPlaceholder`)}
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
										customOptionInput
										customOptionPlaceholder={t(`demographics.race.customOptionPlaceholder`)}
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

							<FormikSubmitButton
								className='btnAddClientSubmit'
								disabled={!values.firstName || !values.lastName || isSubmitButtonDisabled}
							>
								{t('addClient.buttons.createClient')}
							</FormikSubmitButton>
							{submitMessage && (
								<div className='mt-5 alert alert-danger'>{t('addClient.submitMessage.failed')}</div>
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
