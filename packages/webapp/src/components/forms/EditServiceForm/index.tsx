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
import {
	Service,
	ServiceCustomField,
	ServiceCustomFieldInput
} from '@cbosuite/schema/lib/client-types'
import { useTranslation } from '~hooks/useTranslation'

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

	const loadFormFieldData = (fields: ServiceCustomField[]): IFormBuilderFieldProps[] => {
		return fields.map(
			(field) =>
				({
					label: field.fieldName,
					fieldType: field.fieldType,
					fieldRequirement: field.fieldRequirements
				} as IFormBuilderFieldProps)
		)
	}

	const createFormFieldData = (fields: IFormBuilderFieldProps[]): ServiceCustomFieldInput[] => {
		const custFields = []
		for (const field of fields) {
			if (!!field.label && !!field.fieldType && !!field.fieldRequirement) {
				custFields.push({
					fieldName: field.label,
					fieldType: field.fieldType,
					fieldRequirements: field.fieldRequirement,
					fieldValue: field?.value ? [field.value] : []
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
			newFields.push({ label: '' })
		} else {
			newFields.splice(index + 1, 0, { label: '' })
		}
		setFormFields(newFields)
	}

	return (
		<>
			<Formik
				validateOnBlur
				initialValues={{
					name: service.name,
					description: service.description,
					tags: service.tags?.map((tag) => {
						return {
							label: tag.label,
							value: tag.id
						}
					})
				}}
				onSubmit={(values) => {
					const _values = {
						name: values.name,
						description: values.description,
						tags: values.tags?.map((i) => i.value),
						customFields: createFormFieldData(formFields)
					}
					onSubmit?.(_values)
				}}
			>
				{({ errors, touched }) => {
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
										</>
									</Col>
									<Col lg={7} className='ps-5'>
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
								<Row>
									<Col className='mt-5'>
										<FormikSubmitButton>
											{t('editService.buttons.updateService')}
										</FormikSubmitButton>
									</Col>
								</Row>
							</Form>
						</>
					)
				}}
			</Formik>
		</>
	)
})
export default EditServiceForm
