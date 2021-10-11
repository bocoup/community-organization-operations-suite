/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import {
	TextField,
	DatePicker,
	Checkbox,
	ChoiceGroup,
	Label,
	PrimaryButton,
	DefaultButton,
	IDatePickerStyles
} from '@fluentui/react'
import { Icon } from '~ui/Icon'
import { Col, Row, Container } from 'react-bootstrap'
import {
	Service,
	ServiceAnswerInput,
	ServiceAnswers,
	ServiceCustomField,
	ServiceCustomFieldValue,
	ServiceFieldAnswerInput
} from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import { ReactSelect, OptionType } from '~ui/ReactSelect'
import { organizationState } from '~store'
import { useRecoilValue } from 'recoil'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useLocale } from '~hooks/useLocale'
import { noop } from '~utils/noop'
import { fieldStyles } from './styles'
import { ContactRow } from './ContactRow'

interface FormGeneratorProps {
	service: Service
	previewMode?: boolean
	editMode?: boolean
	record?: ServiceAnswers
	onAddNewClient?: () => void
	onQuickActions?: () => void
	onSubmit?: (values: ServiceAnswerInput) => void
}

function transformClient(client: Contact): OptionType {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

export const FormGenerator: StandardFC<FormGeneratorProps> = memo(function FormGenerator({
	service,
	previewMode = true,
	editMode = false,
	record,
	onSubmit = noop,
	onAddNewClient = noop,
	onQuickActions = noop
}) {
	const { t } = useTranslation('services')
	const org = useRecoilValue(organizationState)
	const [locale] = useLocale()
	const defaultOptions = org.contacts ? org.contacts.map(transformClient) : []
	const [contacts, setContacts] = useState<OptionType[]>([])
	const [detailedContacts, setDetailedContacts] = useState<Contact[]>([])
	const formValues = useRef<ServiceFieldAnswerInput>({})
	const [disableSubmitForm, setDisableSubmitForm] = useState(true)
	const [notNumericErrorMessage, setNotNumericErrorMessage] = useState<
		{ [fieldId: string]: string } | undefined
	>(undefined)
	const [fieldErrorMessage, setFieldErrorMessage] = useState<
		{ [fieldId: string]: string } | undefined
	>(undefined)

	// NOTE: opted to keep useRef for form values instead of using useState
	// because we want to keep the form values in sync with the form fields
	// made effort to use useState but it is causing too many re-renders for ChoiceGroup when setting a default value
	// with the default value, of teh form only contain a ChoiceGroup, validation is not getting called.

	const validateRequiredFields = (): boolean => {
		let isValid = true
		service?.customFields?.forEach((field) => {
			if (
				field.fieldRequirements === 'required' &&
				(!formValues.current[field.fieldType] ||
					formValues.current[field.fieldType].some(
						(f) => !f.values || f.values.length === 0 || f.values === ''
					))
			) {
				isValid = false
			} else {
			}
		})

		const isValidContacts = service.contactFormEnabled
			? formValues.current['contacts']?.length > 0
			: true
		return isValid && isValidContacts
	}

	const saveFieldValue = (field: ServiceCustomField, value: any) => {
		if (!formValues.current[field.fieldType]) {
			formValues.current[field.fieldType] = [{ fieldId: field.fieldId, values: value }]
		} else {
			const index = formValues.current[field.fieldType].findIndex(
				(f) => f.fieldId === field.fieldId
			)
			if (index === -1) {
				formValues.current[field.fieldType].push({ fieldId: field.fieldId, values: value })
			} else {
				formValues.current[field.fieldType][index].values = value
			}
		}
	}

	const saveFieldMultiValue = (field: ServiceCustomField, value: any, upsertValue: boolean) => {
		if (!formValues.current[field.fieldType]) {
			formValues.current[field.fieldType] = [{ fieldId: field.fieldId, values: [value.id] }]
		} else {
			const index = formValues.current[field.fieldType].findIndex(
				(f) => f.fieldId === field.fieldId
			)
			if (index === -1) {
				formValues.current[field.fieldType].push({ fieldId: field.fieldId, values: [value.id] })
			} else {
				if (upsertValue) {
					formValues.current[field.fieldType][index].values = [
						...(formValues.current[field.fieldType][index].values ?? []),
						value.id
					]
				} else {
					formValues.current[field.fieldType][index].values = formValues.current[field.fieldType][
						index
					].values.filter((v) => v !== value.id)
				}
			}
		}
	}

	const renderFields = (field: ServiceCustomField): JSX.Element => {
		if (field.fieldType === 'singleText' || field.fieldType === 'number') {
			let fieldValue = undefined

			if (editMode) {
				const index = formValues.current[field.fieldType]?.findIndex(
					(f) => f.fieldId === field.fieldId
				)
				if (index === undefined) {
					fieldValue = record?.fieldAnswers[field.fieldType]?.find(
						(f) => f.fieldId === field.fieldId
					)?.values
					saveFieldValue(field, fieldValue)
				}
			}

			return (
				<TextField
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					defaultValue={fieldValue}
					onBlur={(e) => {
						if (field.fieldType === 'number' && isNaN(e.target.value as any)) {
							saveFieldValue(field, '')
							setNotNumericErrorMessage({
								...notNumericErrorMessage,
								[field.fieldId]: t('formGenerator.validation.numeric')
							})
						} else {
							saveFieldValue(field, e.target.value)
							setNotNumericErrorMessage({ ...notNumericErrorMessage, [field.fieldId]: undefined })
						}

						if (field.fieldRequirements === 'required' && e.target.value === '') {
							setFieldErrorMessage({
								...fieldErrorMessage,
								[field.fieldId]: t('formGenerator.validation.required')
							})
						} else {
							setFieldErrorMessage({ ...fieldErrorMessage, [field.fieldId]: undefined })
						}

						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.textField}
					errorMessage={
						notNumericErrorMessage?.[field.fieldId] || fieldErrorMessage?.[field.fieldId]
					}
				/>
			)
		}

		if (field.fieldType === 'multilineText') {
			let fieldValue = undefined

			if (editMode) {
				const index = formValues.current[field.fieldType]?.findIndex(
					(f) => f.fieldId === field.fieldId
				)
				if (index === undefined) {
					fieldValue = record?.fieldAnswers[field.fieldType]?.find(
						(f) => f.fieldId === field.fieldId
					)?.values
					saveFieldValue(field, fieldValue)
				}
			}

			return (
				<TextField
					label={field.fieldName}
					defaultValue={fieldValue}
					autoAdjustHeight
					multiline
					required={field.fieldRequirements === 'required'}
					onBlur={(e) => {
						saveFieldValue(field, e.target.value)
						setDisableSubmitForm(!validateRequiredFields())

						if (field.fieldRequirements === 'required' && e.target.value === '') {
							setFieldErrorMessage({
								...fieldErrorMessage,
								[field.fieldId]: t('formGenerator.validation.required')
							})
						} else {
							setFieldErrorMessage({ ...fieldErrorMessage, [field.fieldId]: undefined })
						}
					}}
					styles={fieldStyles.textField}
					errorMessage={fieldErrorMessage?.[field.fieldId]}
				/>
			)
		}

		if (field.fieldType === 'date') {
			let initialDate = new Date()

			if (editMode) {
				const currDateValue = record?.fieldAnswers[field.fieldType]?.find(
					(f) => f.fieldId === field.fieldId
				).values
				if (currDateValue) {
					initialDate = new Date(currDateValue)
				}
			}

			// prevent overwriting the date if the field is already filled
			if (!formValues.current[field.fieldType]) {
				saveFieldValue(field, initialDate.toISOString())
			} else {
				const index = formValues.current[field.fieldType].findIndex(
					(f) => f.fieldId === field.fieldId
				)
				initialDate = new Date(formValues.current[field.fieldType][index].values)
			}

			return (
				<DatePicker
					allowTextInput
					label={field.fieldName}
					isRequired={field.fieldRequirements === 'required'}
					initialPickerDate={initialDate}
					formatDate={(date) => date.toLocaleDateString(locale)}
					value={initialDate}
					onSelectDate={(date) => {
						saveFieldValue(field, new Date(date).toISOString())
						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.datePicker as Partial<IDatePickerStyles>}
				/>
			)
		}

		if (field.fieldType === 'singleChoice') {
			const options = field?.fieldValue.map((value: ServiceCustomFieldValue, index) => {
				if (previewMode) {
					return {
						key: value.id || `${value.label}_preview__key__${index}`,
						text: value.label
					}
				} else {
					return {
						key: value.id,
						text: value.label
					}
				}
			})

			// prevent overwriting choice if the field is already filled
			let defaultOption = options[0]
			if (!formValues.current[field.fieldType]) {
				if (editMode) {
					const currChoiceValue = record?.fieldAnswers[field.fieldType]?.find(
						(f) => f.fieldId === field.fieldId
					).values
					if (currChoiceValue) {
						defaultOption = options.find((o) => o.key === currChoiceValue)
					}
				}

				saveFieldValue(field, defaultOption.key)
			} else {
				const index = formValues.current[field.fieldType].findIndex(
					(f) => f.fieldId === field.fieldId
				)

				if (index !== -1) {
					defaultOption = options.find(
						(o) => o.text === formValues.current[field.fieldType][index]?.values
					)
				} else {
					saveFieldValue(field, defaultOption.key)
				}
			}

			return (
				<ChoiceGroup
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					options={options}
					defaultSelectedKey={defaultOption?.key}
					onFocus={() => {
						setDisableSubmitForm(!validateRequiredFields())
					}}
					onChange={(e, option) => {
						saveFieldValue(field, option.key)
						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.choiceGroup}
				/>
			)
		}

		if (field.fieldType === 'multiChoice') {
			if (editMode) {
				if (!formValues.current[field.fieldType]) {
					const currValues = record?.fieldAnswers[field.fieldType]?.find(
						(f) => f.fieldId === field.fieldId
					).values

					formValues.current[field.fieldType] = [{ fieldId: field.fieldId, values: currValues }]
				} else {
					const currValues = record?.fieldAnswers[field.fieldType]?.find(
						(f) => f.fieldId === field.fieldId
					).values

					formValues.current[field.fieldType] = [
						...formValues.current[field.fieldType],
						{ fieldId: field.fieldId, values: currValues }
					]
				}
			}

			const isChecked = (id: string): boolean => {
				if (formValues.current[field.fieldType]) {
					return formValues.current[field.fieldType]
						?.find((f) => f.fieldId === field.fieldId)
						?.values?.includes(id)
				}
				return false
			}

			return (
				<>
					<Label
						className='mb-3'
						required={field.fieldRequirements === 'required'}
						styles={{
							root: {
								':after': {
									color: 'var(--bs-danger)'
								}
							}
						}}
					>
						{field.fieldName}
					</Label>
					{field?.fieldValue.map((value: ServiceCustomFieldValue) => {
						return (
							<Checkbox
								className='mb-3'
								key={value.id}
								label={value.label}
								defaultChecked={isChecked(value.id)}
								onChange={(e, checked) => {
									saveFieldMultiValue(field, value, checked)
									setDisableSubmitForm(!validateRequiredFields())
								}}
								styles={fieldStyles.checkbox}
							/>
						)
					})}
				</>
			)
		}

		// currently not used
		if (field.fieldType === 'multiText') {
			return (
				<>
					{field?.fieldValue.map((value: ServiceCustomFieldValue) => {
						return (
							<TextField
								className='mb-3'
								key={value.id}
								label={value.label}
								required={field.fieldRequirements === 'required'}
								onBlur={(e) => {
									saveFieldValue(field, e.target.value)
									setDisableSubmitForm(!validateRequiredFields())
								}}
								styles={fieldStyles.textField}
							/>
						)
					})}
				</>
			)
		}
	}

	const handleSubmit = () => {
		//discard formvalues contact before submit
		const formValuesCopy = { ...formValues.current }
		delete formValuesCopy['contacts']

		const formData: ServiceAnswerInput = {
			serviceId: service.id,
			contacts: detailedContacts.map((c) => c.id),
			fieldAnswers: formValuesCopy
		}
		onSubmit(formData)
	}

	useEffect(() => {
		if (editMode && record?.contacts.length > 0) {
			formValues.current['contacts'] = record.contacts.map((c) => c.id)
			setDetailedContacts(record.contacts)
		}
	}, [record?.contacts, editMode])

	return (
		<div className={!editMode ? styles.previewFormWrapper : null}>
			<Container>
				<Row className='mb-5'>
					<Col>
						<h3 className='mb-3'>{service?.name}</h3>
						<span>{service?.description}</span>
					</Col>
				</Row>
				{!editMode && service?.contactFormEnabled && (
					<Row className='flex-column flex-md-row mb-4 align-items-end'>
						<Col className='mb-3 mb-md-0'>
							<div className={cx(styles.clientField)}>
								{t('formGenerator.addExistingClient')}
								<span className='text-danger'> *</span>
							</div>
							<ReactSelect
								isMulti
								placeholder={t('formGenerator.addClientPlaceholder')}
								options={defaultOptions}
								defaultValue={contacts}
								onChange={(value) => {
									const newOptions = value as unknown as OptionType[]
									setContacts(newOptions)
									const filteredContacts = newOptions.map((c) =>
										org.contacts?.find((cc) => cc.id === c.value)
									)
									setDetailedContacts(filteredContacts)
									formValues.current['contacts'] = filteredContacts
									setDisableSubmitForm(!validateRequiredFields())
								}}
							/>
						</Col>
						{!previewMode && (
							<Col md={3} className='mb-3 mb-md-0'>
								<button className={styles.newClientButton} onClick={onAddNewClient}>
									<span>{t('formGenerator.buttons.addNewClient')}</span>
									<Icon iconName='CircleAdditionSolid' className={cx(styles.buttonIcon)} />
								</button>
							</Col>
						)}
					</Row>
				)}
				{detailedContacts.length > 0 && (
					<Row>
						{detailedContacts.map((contact, index) => (
							<ContactRow contact={contact} key={contact?.id + ':' + index} />
						))}
					</Row>
				)}
				<Row className='mt-3 mb-5'>
					<Col>
						{service?.customFields?.map((field, idx) => {
							return (
								<Row key={idx} className={cx('mb-3', styles.customField)}>
									{renderFields(field)}
								</Row>
							)
						})}
					</Col>
				</Row>
				{!previewMode && (
					<Row>
						<Col>
							<PrimaryButton
								text={t('formGenerator.buttons.submit')}
								className={cx('me-3', styles.submitButton)}
								disabled={disableSubmitForm}
								onClick={handleSubmit}
							/>
						</Col>
						{onQuickActions && (
							<Col md={4}>
								<DefaultButton
									text={t('formGenerator.buttons.quickActions')}
									className={cx('me-3', styles.quickActionsButton)}
									onClick={onQuickActions}
								/>
							</Col>
						)}
					</Row>
				)}
			</Container>
		</div>
	)
})
