/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import FormBuilderField, { IFormBuilderFieldProps } from '~components/ui/FormBuilderField'
import useWindowSize from '~hooks/useWindowSize'
import { Formik, Form } from 'formik'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikField from '~ui/FormikField'
import TagSelect from '~ui/TagSelect'
import {
	Service,
	ServiceCustomField,
	ServiceCustomFieldInput
} from '@cbosuite/schema/lib/client-types'
import { useTranslation } from '~hooks/useTranslation'
import FormikButton from '~components/ui/FormikButton'
import { Modal, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import FormGenerator from '~components/ui/FormGenerator'
import { wrap } from '~utils/appinsights'
import * as yup from 'yup'

interface EditServiceFormProps extends ComponentProps {
	title?: string
	service: Service
	onSubmit?: (values: any) => void
}

const EditServiceForm = memo(function EditServiceForm({
	service,
	onSubmit
}: EditServiceFormProps): JSX.Element {
	const { isLG } = useWindowSize()
	const { t } = useTranslation('services')
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)

	const serviceSchema = yup.object({
		name: yup.string().required(t('editService.yup.required'))
	})

	const transformValues = (values: any): Service => {
		return {
			name: values.name,
			orgId: service.orgId,
			description: values.description,
			tags: values.tags?.map((i) => i.value),
			customFields: createFormFieldData(formFields),
			contactFormEnabled: values.contactFormEnabled
		} as Service
	}

	const loadFormFieldData = useCallback(
		(fields: ServiceCustomField[]): IFormBuilderFieldProps[] => {
			return fields.map(
				(field) =>
					({
						id: field.fieldId,
						label: field.fieldName,
						fieldType: field.fieldType,
						fieldRequirement: field.fieldRequirements,
						value: field.fieldValue,
						disableField: service.serviceStatus === 'ACTIVE'
					} as IFormBuilderFieldProps)
			)
		},
		[service?.serviceStatus]
	)

	const createFormFieldData = (fields: IFormBuilderFieldProps[]): ServiceCustomFieldInput[] => {
		const custFields = []
		for (const field of fields) {
			if (!!field.label && !!field.fieldType && !!field.fieldRequirement) {
				custFields.push({
					fieldId: field.id,
					fieldName: field.label,
					fieldType: field.fieldType,
					fieldRequirements: field.fieldRequirement,
					fieldValue: field?.value ? field.value.map((fv) => ({ id: fv.id, label: fv.label })) : []
				})
			}
		}

		return custFields
	}

	const [formFields, setFormFields] = useState<IFormBuilderFieldProps[]>(
		loadFormFieldData(service?.customFields || [])
	)

	const handleFieldDelete = (index: number) => {
		const newFields = [...formFields]
		newFields.splice(index, 1)
		setFormFields(newFields)
	}

	const handleFieldAdd = (index) => {
		const newFields = [...formFields]
		if (index === formFields.length - 1) {
			newFields.push({ label: '', value: [], disableField: false })
		} else {
			newFields.splice(index + 1, 0, { label: '', value: [], disableField: false })
		}
		setFormFields(newFields)
	}

	const handlePreviewForm = (values) => {
		setSelectedService(transformValues(values))
		showModal()
	}

	useEffect(() => {
		setSelectedService(service)
		setFormFields(loadFormFieldData(service?.customFields || []))
	}, [service, setSelectedService, loadFormFieldData])

	return (
		<>
			<Formik
				validateOnBlur
				initialValues={{
					name: service?.name,
					description: service?.description || '',
					tags: service?.tags?.map((tag) => {
						return {
							label: tag.label,
							value: tag.id
						}
					}),
					tempFormFields: {},
					contactFormEnabled: service?.contactFormEnabled
				}}
				validationSchema={serviceSchema}
				onSubmit={(values) => {
					onSubmit?.(transformValues(values))
				}}
			>
				{({ errors, values }) => {
					return (
						<>
							<Form>
								<Row className='align-items-center mt-5 mb-3 justify-space-between'>
									<Col>
										<h2 className='d-flex align-items-center'>{t('editService.title')}</h2>
									</Col>
									<Col className='d-flex justify-content-end'>
										<Toggle
											label={t('editService.addClientIntakeForm')}
											inlineLabel
											onText={' '}
											offText={' '}
											styles={{
												label: {
													color: 'var(--bs-primary)'
												}
											}}
											defaultChecked={service?.contactFormEnabled}
											onChange={(e, v) => {
												values.contactFormEnabled = v
											}}
										/>
									</Col>
								</Row>
								<Row className='mt-5'>
									<Col lg={5} className='pe-5'>
										<>
											<FormSectionTitle>{t('editService.fields.name')}</FormSectionTitle>

											<FormikField
												name='name'
												placeholder={t('editService.placeholders.name')}
												className={cx('mb-4', styles.field)}
												error={errors.name}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormSectionTitle>{t('editService.fields.description')}</FormSectionTitle>

											<FormikField
												as='textarea'
												name='description'
												placeholder={t('editService.placeholders.description')}
												className={cx('mb-4', styles.field, styles.textareaField)}
												error={errors.description}
												errorClassName={cx(styles.errorLabel)}
											/>

											<FormSectionTitle>{t('editService.fields.tags')}</FormSectionTitle>

											<div className={cx('mb-3', styles.field)}>
												<TagSelect name='tags' placeholder={t('editService.placeholders.tags')} />
											</div>

											{isLG && (
												<div className='mt-5'>
													<FormikSubmitButton className='me-4'>
														{t('editService.buttons.updateService')}
													</FormikSubmitButton>
													<FormikButton
														type='button'
														onClick={() => handlePreviewForm(values)}
														className={cx(styles.previewFormButton)}
													>
														{t('editService.buttons.previewForm')}
													</FormikButton>
												</div>
											)}
										</>
									</Col>
									<Col lg={7} className='ps-5 pe-4'>
										{!isLG && (
											<Row className='my-4'>
												<Col>
													<h4>{t('editService.customFormFields')}</h4>
												</Col>
											</Row>
										)}
										{isLG && (
											<Row className='mb-2'>
												<Col lg='5'>
													<h5>{t('editService.fields.formFields')}</h5>
												</Col>
												<Col lg='3'>
													<h5>{t('editService.fields.dataType')}</h5>
												</Col>
												<Col lg='3'>
													<h5>{t('editService.fields.fieldRequirement')}</h5>
												</Col>
											</Row>
										)}

										{formFields.map((field: IFormBuilderFieldProps, index) => (
											<FormBuilderField
												key={index}
												field={field}
												showDeleteButton={formFields.length > 1}
												onDelete={() => {
													handleFieldDelete(index)
												}}
												onAdd={() => {
													handleFieldAdd(index)
												}}
												isFieldGroupValid={(isValid) => {
													if (!isValid) {
														errors.tempFormFields = 'has error'
													} else {
														if (errors?.tempFormFields) {
															delete errors.tempFormFields
														}
													}
												}}
											/>
										))}
									</Col>
								</Row>
								{!isLG && (
									<Row>
										<Col className='mt-5'>
											<FormikSubmitButton className='me-4'>
												{t('editService.buttons.updateService')}
											</FormikSubmitButton>
											<FormikButton
												type='button'
												onClick={() => handlePreviewForm(values)}
												className={cx(styles.previewFormButton)}
											>
												{t('editService.buttons.previewForm')}
											</FormikButton>
										</Col>
									</Row>
								)}
							</Form>
						</>
					)
				}}
			</Formik>
			<Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
				<FormGenerator service={selectedService} />
			</Modal>
		</>
	)
})
export default wrap(EditServiceForm)
