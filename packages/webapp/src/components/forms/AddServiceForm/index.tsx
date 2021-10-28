/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
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
import {
	Service,
	ServiceFieldInput,
	ServiceFieldRequirement,
	ServiceFieldType
} from '@cbosuite/schema/dist/client-types'
import { useTranslation } from '~hooks/useTranslation'
import { FormikButton } from '~components/ui/FormikButton'
import { Modal, Toggle } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { FormGenerator } from '~components/ui/FormGenerator'
import { wrap } from '~utils/appinsights'
import * as yup from 'yup'
import { noop } from '~utils/noop'

interface AddServiceFormProps {
	title?: string
	onSubmit?: (values: any) => void
}

export const AddServiceForm: StandardFC<AddServiceFormProps> = wrap(function AddServiceForm({
	onSubmit = noop
}) {
	const [formFields, setFormFields] = useState<IFormBuilderFieldProps[]>([
		{
			label: '',
			inputs: [],
			requirement: ServiceFieldRequirement.Optional,
			type: ServiceFieldType.SingleText
		}
	])
	const { isLG } = useWindowSize()
	const { t } = useTranslation('services')
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)
	const [warningMuted, setWarningMuted] = useState(true)
	const serviceSchema = yup.object({
		name: yup.string().required(t('addService.yup.required'))
	})

	const transformValues = useCallback(
		(values: any): Service => {
			return {
				name: values.name,
				orgId: 'preview-org-id',
				description: values.description,
				tags: values.tags?.map((i) => i.value),
				fields: createFormFieldData(formFields),
				contactFormEnabled: values.contactFormEnabled
			} as unknown as Service
		},
		[formFields]
	)

	const createFormFieldData = (fields: IFormBuilderFieldProps[]): ServiceFieldInput[] => {
		const custFields: ServiceFieldInput[] = []
		for (const field of fields) {
			if (!!field.label && !!field.type && !!field.requirement) {
				custFields.push({
					name: field.label,
					type: field.type,
					requirement: field.requirement,
					inputs: field?.inputs ? field.inputs.map((fv) => ({ id: fv.id, label: fv.label })) : []
				})
			}
		}
		return custFields
	}

	const handleFieldDelete = useCallback(
		(index: number) => {
			const newFields = [...formFields]
			newFields.splice(index, 1)
			setFormFields(newFields)
		},
		[formFields]
	)

	const handleFieldAdd = useCallback(
		(index) => {
			const newFields = [...formFields]
			if (index === formFields.length - 1) {
				newFields.push({
					label: '',
					inputs: [],
					requirement: ServiceFieldRequirement.Optional,
					type: ServiceFieldType.SingleText
				})
			} else {
				newFields.splice(index + 1, 0, {
					label: '',
					inputs: [],
					requirement: ServiceFieldRequirement.Optional,
					type: ServiceFieldType.SingleText
				})
			}
			setFormFields(newFields)
		},
		[formFields]
	)

	const handleFieldMoveUp = useCallback(
		(index: number) => {
			if (index > 0 && index <= formFields.length - 1) {
				const newFields = [...formFields]
				const item = formFields[index]
				const swapped = formFields[index - 1]
				newFields[index - 1] = item
				newFields[index] = swapped
				setFormFields(newFields)
			}
		},
		[formFields]
	)

	const handleFieldMoveDown = useCallback(
		(index: number) => {
			if (index >= 0 && index < formFields.length - 1) {
				const newFields = [...formFields]
				const item = formFields[index]
				const swapped = formFields[index + 1]
				newFields[index + 1] = item
				newFields[index] = swapped
				setFormFields(newFields)
			}
		},
		[formFields]
	)

	const handlePreviewForm = useCallback(
		(values) => {
			setSelectedService(transformValues(values))
			showModal()
		},
		[transformValues, showModal]
	)

	return (
		<>
			<Formik
				validateOnMount
				initialValues={{
					name: '',
					description: '',
					tags: null,
					contactFormEnabled: false,
					tempFormFields: {}
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
										<h2 className='d-flex align-items-center'>{t('addService.title')}</h2>

										<div className={cx('text-muted')}>{t('addService.description')}</div>
									</Col>
								</Row>
								<Row className='mt-5'>
									<Col lg={5} className='pe-5'>
										<>
											<FormSectionTitle>{t('addService.fields.name')}</FormSectionTitle>
											<div className='mb-4'>{t('addService.fields.nameSubText')}</div>

											<FormikField
												name='name'
												placeholder={t('addService.placeholders.name')}
												className={cx('mb-4', styles.field)}
												error={errors.name}
												id='inputServiceName'
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormSectionTitle className='mt-4'>
												{t('addService.fields.description')}
											</FormSectionTitle>

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
													<FormikSubmitButton className='me-4 btnCreateService'>
														{t('addService.buttons.createService')}
													</FormikSubmitButton>
													<FormikButton
														type='button'
														onClick={() => handlePreviewForm(values)}
														className={cx(styles.previewFormButton, 'btnPreviewService')}
													>
														{t('addService.buttons.previewForm')}
													</FormikButton>
												</div>
											)}
										</>
									</Col>
									<Col lg={7} className='ps-5 pe-4'>
										{!isLG && (
											<Row className='my-4'>
												<Col>
													<h4>{t('addService.customFormFields')}</h4>
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
												onText={t('addService.addClientIntakeForm')}
												offText={t('addService.addClientIntakeForm')}
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
											{t('addService.clientContentWarning')}
										</div>
										{isLG && (
											<>
												<Row className='mb-2'>
													<Col lg='6'>
														<h5>{t('addService.fields.formFields')}</h5>
													</Col>
													<Col lg='3'>
														<h5>{t('addService.fields.dataType')}</h5>
													</Col>
													<Col lg='2'>
														<h5>{t('addService.fields.fieldRequirement')}</h5>
													</Col>
												</Row>
												<Row className='mb-4'>
													<Col lg='6'>
														<div>{t('addService.customFormDescription')}</div>
													</Col>
													<Col lg='6'>
														<div>{t('addService.customFormFieldsDescription')}</div>
													</Col>
												</Row>
											</>
										)}

										{formFields.map((field, index) => (
											<FormBuilderField
												key={index}
												field={field}
												className={`form-field-${index}`}
												showDeleteButton={formFields.length > 1}
												onAdd={() => handleFieldAdd(index)}
												onDelete={() => handleFieldDelete(index)}
												onMoveUp={() => handleFieldMoveUp(index)}
												onMoveDown={() => handleFieldMoveDown(index)}
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
			<Modal
				isOpen={isModalOpen}
				onDismiss={hideModal}
				isBlocking={false}
				className='servicePreviewModal'
			>
				<FormGenerator service={selectedService} />
			</Modal>
		</>
	)
})
