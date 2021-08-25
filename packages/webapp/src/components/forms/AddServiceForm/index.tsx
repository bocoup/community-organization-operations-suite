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

interface AddServiceFormProps extends ComponentProps {
	title?: string
	onSubmit?: (values: any) => void
}

const AddServiceForm = memo(function AddServiceForm({
	onSubmit
}: AddServiceFormProps): JSX.Element {
	const [formFields, setFormFields] = useState<IFormBuilderFieldProps[]>([{ label: '' }])
	const { isLG } = useWindowSize()

	const handleFieldDelete = (index: number) => {
		const newFields = [...formFields]
		newFields.splice(index, 1)
		setFormFields(newFields)
	}

	const handleFieldChange = (index: string, updatedField: IFormBuilderFieldProps) => {
		const newFields = [...formFields]
		newFields[index] = updatedField
		console.log('formFields', formFields)
	}

	const handleFieldAdd = index => {
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
				initialValues={{ title: '', description: '', tags: null }}
				onSubmit={values => {
					const _values = {
						...values,
						title: values.title,
						tags: values.tags?.map(i => i.value)
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
										<h2 className='d-flex align-items-center'>Add a New Service</h2>
									</Col>
									<Col className='d-flex justify-content-end'>
										{/* TODO: TRANSLATE */}
										<FormikSubmitButton>Submit</FormikSubmitButton>
										{/* 								
										<button className={cx(styles.addFormFieldButton)} onClick={() => onAddFieldClick()}>
											<span>Add Form Field</span>
											<Icon iconName='CircleAdditionSolid' className={cx(styles.buttonIcon)} />
										</button> 
										*/}
									</Col>
								</Row>
								<Row className='mt-5'>
									<Col lg={5}>
										<>
											<FormSectionTitle>Service Name</FormSectionTitle>
											{/* TODO: translate */}

											<FormikField
												name='title'
												placeholder={'Service title'}
												className={cx('mb-3', styles.field)}
												// error={errors.title}
												errorClassName={cx(styles.errorLabel)}
											/>
											{/* TODO: translate */}

											<FormikField
												as='textarea'
												name='description'
												placeholder='Add a description'
												className={cx('mb-3', styles.field, styles.textareaField)}
												error={errors.description}
												errorClassName={cx(styles.errorLabel)}
											/>

											{/* TODO: translate */}

											<div className={cx('mb-3', styles.field)}>
												<TagSelect name='tags' placeholder='Add a tag' />
											</div>
										</>
									</Col>
									<Col lg={7}>
										{!isLG && (
											<Row className='my-4'>
												{/* TODO: add translations */}
												<Col>
													<h4>Custom Form Fields</h4>
												</Col>
											</Row>
										)}
										{isLG && (
											<Row className='mb-3'>
												{/* TODO: add translations */}
												<Col lg='5'>
													<h4>Form Fields</h4>
												</Col>
												<Col lg='3'>
													<h4>Data type</h4>
												</Col>
												<Col lg='3'>
													<h4>Requirement</h4>
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
												onChange={(id, field) => handleFieldChange(id, field)}
											/>
										))}
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
export default AddServiceForm
