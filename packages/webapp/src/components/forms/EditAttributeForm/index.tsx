/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import * as yup from 'yup'
import { Formik, Form } from 'formik'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikField from '~ui/FormikField'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { memo, useState } from 'react'
import { Attribute, AttributeInput } from '@greenlight/schema/lib/client-types'
import { useAttributes } from '~hooks/api/useAttributes'

interface EditAttributeFormProps extends ComponentProps {
	title?: string
	orgId: string
	attribute: Attribute
	closeForm?: () => void
}

const EditAttributeValidationSchema = yup.object().shape({
	label: yup.string().required('Required').max(15, 'Must be less than 15 characters'),
	description: yup.string()
})

const EditAttributeForm = memo(function EditAttributeForm({
	title,
	orgId,
	className,
	attribute,
	closeForm
}: EditAttributeFormProps): JSX.Element {
	const { updateAttribute } = useAttributes()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const handleUpdateAttribute = async values => {
		const currAttribute: AttributeInput = {
			id: attribute.id,
			orgId,
			label: values.label,
			description: values.description
		}

		const response = await updateAttribute(currAttribute)
		if (response.status === 'success') {
			setSubmitMessage(null)
			closeForm?.()
		} else {
			setSubmitMessage(response.message)
		}
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					label: attribute.label,
					description: attribute.description
				}}
				validationSchema={EditAttributeValidationSchema}
				onSubmit={values => {
					handleUpdateAttribute(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormTitle>{title}</FormTitle>
							<FormSectionTitle className='mt-5'>Attribute info</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='label'
										placeholder='Attribute name'
										className={cx(styles.field)}
										error={errors.label}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										as='textarea'
										name='description'
										placeholder='Attribute description'
										className={cx(styles.field, styles.textareaField)}
										error={errors.description}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>Save</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>Submit Failed: {submitMessage}</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})

export default EditAttributeForm
