/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
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
import { Service, ServiceCustomFieldInput } from '@cbosuite/schema/lib/client-types'
import { useTranslation } from '~hooks/useTranslation'
import FormikButton from '~components/ui/FormikButton'
import { Modal, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import FormGenerator from '~components/ui/FormGenerator'

interface AddServiceFormProps extends ComponentProps {
	title?: string
	onSubmit?: (values: any) => void
}

const AddServiceForm = memo(function AddServiceForm({
	onSubmit
}: AddServiceFormProps): JSX.Element {
	const [formFields, setFormFields] = useState<IFormBuilderFieldProps[]>([{ label: '' }])
	const { isLG } = useWindowSize()
	const { t } = useTranslation('services')
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)

	const createFormFieldData = (fields: IFormBuilderFieldProps[]): ServiceCustomFieldInput[] => {
		const custFields = []
		for (const field of fields) {
			if (!!field.label && !!field.fieldType && !!field.fieldRequirement) {
				custFields.push({
					fieldName: field.label,
					fieldType: field.fieldType,
					fieldRequirements: field.fieldRequirement,
					fieldValue: field?.value ? field.value : []
				})
			}
		}
		return custFields
	}

	const handleFieldDelete = (index: number) => {
		const newFields = [...formFields]
		newFields.splice(index, 1)
		setFormFields(newFields)
	}

	const handleFieldAdd = (index) => {
		const newFields = [...formFields]
		if (index === formFields.length - 1) {
			newFields.push({ label: '' })
		} else {
			newFields.splice(index + 1, 0, { label: '' })
		}
		setFormFields(newFields)
	}

	const handlePreviewForm = (values) => {
		const _values = {
			name: values.name,
			id: 'preview-form-id',
			orgId: 'preview-org-id',
			description: values.description,
			tags: values.tags?.map((i) => i.value),
			customFields: createFormFieldData(formFields),
			contactFormEnabled: values.contactFormEnabled
		} as Service
		setSelectedService(_values)
		showModal()
	}

	return (
		<>
			<Formik
				validateOnBlur
				initialValues={{ name: '', description: '', tags: null }}
				onSubmit={(values) => {
					const _values = {
						...values,
						name: values.name,
						tags: values.tags?.map((i) => i.value),
						customFields: createFormFieldData(formFields)
					}
					onSubmit?.(_values)
				}}
			>
				{({ errors, values }) => {
					return (
						<>
							<Form>
								<Row className='align-items-center mt-5 mb-3 justify-space-between'>
									<Col>
										<h2 className='d-flex align-items-center'>{t('addService.title')}</h2>
									</Col>
									<Col className='d-flex justify-content-end'>
										<Toggle
											label={t('addService.addClientIntakeForm')}
											inlineLabel
											onText={' '}
											offText={' '}
											styles={{
												label: {
													color: 'var(--bs-primary)'
												}
											}}
										/>
									</Col>
								</Row>
								<Row className='mt-5'>
									<Col lg={5} className='pe-5'>
										<>
											<FormSectionTitle>{t('addService.fields.name')}</FormSectionTitle>

											<FormikField
												name='name'
												placeholder={t('addService.placeholders.name')}
												className={cx('mb-4', styles.field)}
												error={errors.name}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormSectionTitle>{t('addService.fields.description')}</FormSectionTitle>

											<FormikField
												as='textarea'
												name='description'
												placeholder={t('addService.placeholders.description')}
												className={cx('mb-4', styles.field, styles.textareaField)}
												error={errors.description}
												errorClassName={cx(styles.errorLabel)}
											/>

											<FormSectionTitle>{t('addService.fields.tags')}</FormSectionTitle>

											<div className={cx('mb-3', styles.field)}>
												<TagSelect name='tags' placeholder={t('addService.placeholders.tags')} />
											</div>
											{isLG && (
												<div className='mt-5'>
													<FormikSubmitButton className='me-4'>
														{t('addService.buttons.createService')}
													</FormikSubmitButton>
													<FormikButton
														type='button'
														onClick={() => handlePreviewForm(values)}
														className={cx(styles.previewFormButton)}
													>
														{t('addService.buttons.previewForm')}
													</FormikButton>
												</div>
											)}
										</>
									</Col>
									<Col lg={7} className='ps-5'>
										{!isLG && (
											<Row className='my-4'>
												<Col>
													<h4>{t('addService.customFormFields')}</h4>
												</Col>
											</Row>
										)}
										{isLG && (
											<Row className='mb-2'>
												<Col lg='5'>
													<h5>{t('addService.fields.formFields')}</h5>
												</Col>
												<Col lg='3'>
													<h5>{t('addService.fields.dataType')}</h5>
												</Col>
												<Col lg='3'>
													<h5>{t('addService.fields.fieldRequirement')}</h5>
												</Col>
											</Row>
										)}

										{formFields.map((field, index) => (
											<FormBuilderField
												key={index}
												field={field}
												showDeleteButton={formFields.length > 1}
												onDelete={() => handleFieldDelete(index)}
												onAdd={() => handleFieldAdd(index)}
											/>
										))}
									</Col>
								</Row>
								{!isLG && (
									<Row>
										<Col className='mt-5'>
											<FormikSubmitButton className='me-4'>
												{t('addService.buttons.createService')}
											</FormikSubmitButton>
											<FormikButton
												type='button'
												onClick={() => handlePreviewForm(values)}
												className={cx(styles.previewFormButton)}
											>
												{t('addService.buttons.previewForm')}
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
export default AddServiceForm
