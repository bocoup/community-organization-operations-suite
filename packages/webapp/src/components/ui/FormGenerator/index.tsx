/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { TextField, DatePicker, Checkbox, ChoiceGroup, Label } from '@fluentui/react'
import { Col, Row, Container } from 'react-bootstrap'
import { Service, ServiceCustomField } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import { useTranslation } from '~hooks/useTranslation'
import ReactSelect, { OptionType } from '~ui/ReactSelect'
import { organizationState } from '~store'
import { useRecoilValue } from 'recoil'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useRouter } from 'next/router'
import ContactInfo from '../ContactInfo'

interface FormGeneratorProps extends ComponentProps {
	service: Service
}

const transformClient = (client: Contact): OptionType => {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}

const FormGenerator = memo(function FormGenerator({ service }: FormGeneratorProps): JSX.Element {
	const { t } = useTranslation('services')
	const router = useRouter()
	const org = useRecoilValue(organizationState)
	const defaultOptions = org.contacts ? org.contacts.map(transformClient) : []
	const [contacts, setContacts] = useState<OptionType[]>(service.contacts?.map(transformClient))
	const [detailedContacts, setDetailedContacts] = useState<Contact[]>(service.contacts ?? [])

	const renderFields = (field: ServiceCustomField): JSX.Element => {
		if (field.fieldType === 'single-text' || field.fieldType === 'number') {
			return <TextField label={field.fieldName} required={field.fieldRequirements === 'required'} />
		}

		if (field.fieldType === 'multiline-text') {
			return (
				<TextField
					label={field.fieldName}
					autoAdjustHeight
					multiline
					required={field.fieldRequirements === 'required'}
				/>
			)
		}

		if (field.fieldType === 'date') {
			const today = new Date()
			return (
				<DatePicker
					label={field.fieldName}
					isRequired={field.fieldRequirements === 'required'}
					initialPickerDate={today}
					value={today}
				/>
			)
		}

		if (field.fieldType === 'single-choice') {
			return (
				<ChoiceGroup
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					options={field?.fieldValue.map((c: string) => {
						return {
							key: `${c.replaceAll(' ', '_')}-__key`,
							text: c
						}
					})}
				/>
			)
		}

		if (field.fieldType === 'multi-choice') {
			return (
				<>
					<Label className='mb-3' required={field.fieldRequirements === 'required'}>
						{field.fieldName}
					</Label>
					{field?.fieldValue.map((c: string) => {
						return <Checkbox className='mb-3' key={`${c.replaceAll(' ', '_')}-__key`} label={c} />
					})}
				</>
			)
		}

		if (field.fieldType === 'multi-text') {
			return (
				<>
					{field?.fieldValue.map((c: string) => {
						return (
							<TextField
								className='mb-3'
								key={`${c.replaceAll(' ', '_')}-__key`}
								label={c}
								required={field.fieldRequirements === 'required'}
							/>
						)
					})}
				</>
			)
		}
	}

	return (
		<div className={styles.previewFormWrapper}>
			<Container>
				<Row className='mb-5'>
					<Col>
						<h3>{service?.name}</h3>
						<span>{service?.description}</span>
					</Col>
				</Row>
				{service.contactFormEnabled && (
					<Row className='flex-column flex-md-row mb-4'>
						<Col className='mb-3 mb-md-0'>
							<FormSectionTitle>{t('formGenerator.addExistingClient')}</FormSectionTitle>
							<ReactSelect
								isMulti
								placeholder={t('formGenerator.addClientPlaceholder')}
								options={defaultOptions}
								defaultValue={contacts}
								onChange={(value) => {
									const newOptions = value as unknown as OptionType[]
									setContacts(newOptions)
									setDetailedContacts(
										newOptions.map((c) => org.contacts?.find((cc) => cc.id === c.value))
									)
								}}
							/>
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
			</Container>
		</div>
	)
})
export default FormGenerator
