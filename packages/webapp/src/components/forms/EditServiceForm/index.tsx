/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import { FormBuilderField, IFormBuilderFieldProps } from '~components/ui/FormBuilderField'
import { useWindowSize } from '~hooks/useWindowSize'
import { Formik, Form } from 'formik'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import { FormikField } from '~ui/FormikField'
import { TagSelect } from '~ui/TagSelect'
import { Service, ServiceField, ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormikButton } from '~components/ui/FormikButton'
import { Modal, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { FormGenerator } from '~components/ui/FormGenerator'
import { wrap } from '~utils/appinsights'
import * as yup from 'yup'
import { empty, noop } from '~utils/noop'
import { useFormBuilderHelpers } from '~hooks/useFormBuilderHelpers'

interface EditServiceFormProps {
	title?: string
	service: Service
	onSubmit?: (values: any) => void
}

export const EditServiceForm: StandardFC<EditServiceFormProps> = wrap(function EditServiceForm({
	service,
	onSubmit = noop
}) {
	const { isLG } = useWindowSize()
	const { t } = useTranslation(Namespace.Services)
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [warningMuted, setWarningMuted] = useState(true)

	const serviceSchema = yup.object({
		name: yup.string().required(t('editService.yup.required'))
	})

	const loadFormFieldData = useCallback(
		(fields: ServiceField[]): IFormBuilderFieldProps[] => {
			const newFields: IFormBuilderFieldProps[] = fields.map(
				(field) =>
					({
						id: field.id,
						label: field.name,
						type: field.type,
						requirement: field.requirement,
						inputs: field.inputs,
						disableField: service.status === ServiceStatus.Active
					} as IFormBuilderFieldProps)
			)

			return newFields
		},
		[service?.status]
	)

	const {
		fields: formFields,
		setFields: setFormFields,
		transformValues,
		handleAddField,
		handleDeleteField,
		handleMoveFieldUp,
		handleMoveFieldDown
	} = useFormBuilderHelpers(loadFormFieldData(service?.fields ?? []), service?.orgId)

	const handlePreviewForm = (values) => {
		setSelectedService(transformValues(values))
		showModal()
	}

	useEffect(() => {
		setSelectedService(service)
		setFormFields(loadFormFieldData(service?.fields ?? empty))
	}, [service, setSelectedService, loadFormFieldData, setFormFields])

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
					onSubmit(transformValues(values))
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
								</Row>
								<Row className='mt-5'>
									<Col lg={5} className='pe-5'>
										<>
											<FormSectionTitle>{t('editService.fields.name')}</FormSectionTitle>
											<div className='mb-4'>{t('editService.fields.nameSubText')}</div>

											<FormikField
												name='name'
												placeholder={t('editService.placeholders.name')}
												className={cx('mb-4', styles.field)}
												error={errors.name}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormSectionTitle className='mt-4'>
												{t('editService.fields.description')}
											</FormSectionTitle>

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
										<div
											className={cx(
												styles.clientContentWarning,
												warningMuted && styles.warningMuted,
												'alert alert-primary'
											)}
										>
											<Toggle
												inlineLabel
												onText={t('editService.addClientIntakeForm')}
												offText={t('editService.addClientIntakeForm')}
												styles={{
													text: {
														color: 'var(--bs-primary)',
														cursor: 'pointer'
													}
												}}
												className='text-primary'
												defaultChecked={values.contactFormEnabled}
												onChange={(e, v) => {
													values.contactFormEnabled = v
													setWarningMuted(!v)
												}}
											/>
											{t('editService.clientContentWarning')}
										</div>
										{isLG && (
											<>
												<Row className='mb-2'>
													<Col lg='6'>
														<h5>{t('editService.fields.formFields')}</h5>
													</Col>
													<Col lg='3'>
														<h5>{t('editService.fields.dataType')}</h5>
													</Col>
													<Col lg='1'>
														<h5>{t('editService.fields.fieldRequirement')}</h5>
													</Col>
												</Row>
												<Row className='mb-4'>
													<Col lg='6'>
														<div>{t('editService.customFormDescription')}</div>
													</Col>
													<Col lg='6'>
														<div>{t('editService.customFormFieldsDescription')}</div>
													</Col>
												</Row>
											</>
										)}

										{formFields.map((field: IFormBuilderFieldProps, index) => (
											<FormBuilderField
												key={index}
												field={field}
												showDeleteButton={formFields.length > 1}
												onAdd={() => handleAddField(index)}
												onDelete={() => handleDeleteField(index)}
												onMoveUp={() => handleMoveFieldUp(index)}
												onMoveDown={() => handleMoveFieldDown(index)}
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
