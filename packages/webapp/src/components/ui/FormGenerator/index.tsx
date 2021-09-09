/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
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
import Icon from '~ui/Icon'
import { Col, Row, Container } from 'react-bootstrap'
import {
	Service,
	ServiceAnswerInput,
	ServiceCustomField,
	ServiceFieldAnswerInput
} from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'
import ReactSelect, { OptionType } from '~ui/ReactSelect'
import { organizationState } from '~store'
import { useRecoilValue } from 'recoil'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useRouter } from 'next/router'
import ContactInfo from '../ContactInfo'

interface FormGeneratorProps extends ComponentProps {
	service: Service
	previewMode?: boolean
	onAddNewClient?: () => void
	onQuickActions?: () => void
	onSubmit?: (values: ServiceAnswerInput) => void
}

const transformClient = (client: Contact): OptionType => {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

const fieldStyles = {
	textField: {
		field: {
			fontSize: 12,
			'::placeholder': {
				fontSize: 12
			}
		},
		fieldGroup: {
			borderColor: 'var(--bs-gray-4)',
			borderRadius: 4,
			':hover': {
				borderColor: 'var(--bs-primary)'
			},
			':after': {
				borderRadius: 4,
				borderWidth: 1
			}
		},
		wrapper: {
			selectors: {
				'.ms-Label': {
					':after': {
						color: 'var(--bs-danger)'
					}
				}
			}
		}
	},
	choiceGroup: {
		root: {
			selectors: {
				'.ms-ChoiceField-field': {
					':before': {
						borderColor: 'var(--bs-gray-4)'
					}
				}
			}
		},
		label: {
			':after': {
				color: 'var(--bs-danger)'
			}
		}
	},
	checkbox: {
		checkbox: {
			borderColor: 'var(--bs-gray-4)'
		}
	},
	datePicker: {
		root: {
			border: 0
		},
		wrapper: {
			border: 0
		},
		textField: {
			selectors: {
				'.ms-TextField-fieldGroup': {
					borderRadius: 4,
					height: 34,
					borderColor: 'var(--bs-gray-4)',
					':after': {
						outline: 0,
						border: 0
					},
					':hover': {
						borderColor: 'var(--bs-primary)'
					}
				},
				'.ms-Label': {
					':after': {
						color: 'var(--bs-danger)'
					}
				}
			}
		}
	}
}

const FormGenerator = memo(function FormGenerator({
	service,
	previewMode = true,
	onSubmit,
	onAddNewClient,
	onQuickActions
}: FormGeneratorProps): JSX.Element {
	const { t } = useTranslation('services')
	const router = useRouter()
	const org = useRecoilValue(organizationState)
	const defaultOptions = org.contacts ? org.contacts.map(transformClient) : []
	const [contacts, setContacts] = useState<OptionType[]>([])
	const [detailedContacts, setDetailedContacts] = useState<Contact[]>([])
	const formValues = useRef<ServiceFieldAnswerInput>({})
	const [disableSubmitForm, setDisableSubmitForm] = useState(true)

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
						(f) => !f.value || f.value.length === 0 || f.value === ''
					))
			) {
				isValid = false
			}
		})

		const isValidContacts = service.contactFormEnabled
			? formValues.current['contacts']?.length > 0
			: true
		return isValid && isValidContacts
	}

	const saveFieldValue = (field: ServiceCustomField, value: any) => {
		if (!formValues.current[field.fieldType]) {
			formValues.current[field.fieldType] = [{ label: field.fieldName, value }]
		} else {
			const index = formValues.current[field.fieldType].findIndex(
				(f) => f.label === field.fieldName
			)
			if (index === -1) {
				formValues.current[field.fieldType].push({ label: field.fieldName, value })
			} else {
				formValues.current[field.fieldType][index].value = value
			}
		}
	}

	const saveFieldMultiValue = (field: ServiceCustomField, value: any, upsertValue: boolean) => {
		if (!formValues.current[field.fieldType]) {
			formValues.current[field.fieldType] = [{ label: field.fieldName, value: [value] }]
		} else {
			const index = formValues.current[field.fieldType].findIndex(
				(f) => f.label === field.fieldName
			)
			if (index === -1) {
				formValues.current[field.fieldType].push({ label: field.fieldName, value: [value] })
			} else {
				if (upsertValue) {
					formValues.current[field.fieldType][index].value = [
						...(formValues.current[field.fieldType][index].value ?? []),
						value
					]
				} else {
					formValues.current[field.fieldType][index].value = formValues.current[field.fieldType][
						index
					].value.filter((v) => v !== value)
				}
			}
		}
	}

	const renderFields = (field: ServiceCustomField): JSX.Element => {
		if (field.fieldType === 'singleText' || field.fieldType === 'number') {
			return (
				<TextField
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					onBlur={(e) => {
						saveFieldValue(field, e.target.value)
						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.textField}
				/>
			)
		}

		if (field.fieldType === 'multilineText') {
			return (
				<TextField
					label={field.fieldName}
					autoAdjustHeight
					multiline
					required={field.fieldRequirements === 'required'}
					onBlur={(e) => {
						saveFieldValue(field, e.target.value)
						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.textField}
				/>
			)
		}

		if (field.fieldType === 'date') {
			let initialDate = new Date()

			// prevent overwriting the date if the field is already filled
			if (!formValues.current[field.fieldType]) {
				saveFieldValue(field, initialDate.toISOString())
			} else {
				const index = formValues.current[field.fieldType].findIndex(
					(f) => f.label === field.fieldName
				)
				initialDate = new Date(formValues.current[field.fieldType][index].value)
			}

			return (
				<DatePicker
					label={field.fieldName}
					isRequired={field.fieldRequirements === 'required'}
					initialPickerDate={initialDate}
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
			const options = field?.fieldValue.map((c: string) => {
				return {
					key: `${c.replaceAll(' ', '_')}-__key`,
					text: c
				}
			})
			saveFieldValue(field, options[0].text)

			return (
				<ChoiceGroup
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					options={options}
					defaultSelectedKey={options[0].key}
					onFocus={() => {
						setDisableSubmitForm(!validateRequiredFields())
					}}
					onChange={(e, option) => {
						saveFieldValue(field, option.text)
						setDisableSubmitForm(!validateRequiredFields())
					}}
					styles={fieldStyles.choiceGroup}
				/>
			)
		}

		if (field.fieldType === 'multiChoice') {
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
					{field?.fieldValue.map((c: string) => {
						return (
							<Checkbox
								className='mb-3'
								key={`${c.replaceAll(' ', '_')}-__key`}
								label={c}
								onChange={(e, checked) => {
									saveFieldMultiValue(field, c, checked)
									setDisableSubmitForm(!validateRequiredFields())
								}}
								styles={fieldStyles.checkbox}
							/>
						)
					})}
				</>
			)
		}

		if (field.fieldType === 'multiText') {
			return (
				<>
					{field?.fieldValue.map((c: string) => {
						return (
							<TextField
								className='mb-3'
								key={`${c.replaceAll(' ', '_')}-__key`}
								label={c}
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
		onSubmit?.(formData)
	}

	return (
		<div className={styles.previewFormWrapper}>
			<Container>
				<Row className='mb-5'>
					<Col>
						<h3 className='mb-3'>{service?.name}</h3>
						<span>{service?.description}</span>
					</Col>
				</Row>
				{service?.contactFormEnabled && (
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
						<Col md={3} className='mb-3 mb-md-0'>
							<button className={styles.newClientButton} onClick={() => onAddNewClient?.()}>
								<span>{t('formGenerator.buttons.addNewClient')}</span>
								<Icon iconName='CircleAdditionSolid' className={cx(styles.buttonIcon)} />
							</button>
						</Col>
					</Row>
				)}
				{detailedContacts.length > 0 && (
					<Row>
						{detailedContacts.map((contact, index) => (
							<Col key={index} md={6} className='mb-4'>
								<div className={styles.contactContainer}>
									<div className='d-block text-primary'>
										<strong>
											{contact.name.first} {contact.name.last}
										</strong>
									</div>
									<div className='d-block mb-2'>
										Birthdate:{' '}
										<strong>
											{new Intl.DateTimeFormat(router.locale).format(new Date(contact.dateOfBirth))}
										</strong>
									</div>
									<div className={styles.contactInfo}>
										<ContactInfo
											contact={{
												email: contact.email,
												phone: contact.phone,
												address: contact.address
											}}
										/>
									</div>
								</div>
							</Col>
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
								onClick={() => handleSubmit()}
							/>
						</Col>
						{onQuickActions && (
							<Col md={4}>
								<DefaultButton
									text={t('formGenerator.buttons.quickActions')}
									className={cx('me-3', styles.quickActionsButton)}
									onClick={() => onQuickActions?.()}
								/>
							</Col>
						)}
					</Row>
				)}
			</Container>
		</div>
	)
})
export default FormGenerator
