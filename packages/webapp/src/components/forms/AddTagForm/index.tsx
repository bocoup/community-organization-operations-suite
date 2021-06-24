/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import * as yup from 'yup'
import type ComponentProps from '~types/ComponentProps'
import { Formik, Form } from 'formik'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikField from '~ui/FormikField'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useTag } from '~hooks/api/useTag'
import { TagInput } from '@greenlight/schema/lib/client-types'
import { memo, useState } from 'react'

interface AddTagFormProps extends ComponentProps {
	title?: string
	orgId: string
	closeForm?: () => void
}

const NewTagValidationSchema = yup.object().shape({
	label: yup.string().required('Required'),
	description: yup.string()
})

const AddTagForm = memo(function AddTagForm({
	title,
	orgId,
	className,
	closeForm
}: AddTagFormProps): JSX.Element {
	const { createTag } = useTag()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const handleCreateTag = async values => {
		const newTag: TagInput = {
			label: values.label,
			description: values.description
		}

		const response = await createTag(orgId, newTag)
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
					label: '',
					description: ''
				}}
				validationSchema={NewTagValidationSchema}
				onSubmit={values => {
					handleCreateTag(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormTitle>{title}</FormTitle>
							<FormSectionTitle className='mt-5'>Tag info</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='label'
										placeholder='Tag name'
										className={cx(styles.field)}
										error={errors.label}
										errorClassName={cx(styles.errorLabel)}
									/>
									<FormikField
										as='textarea'
										name='description'
										placeholder='Tag description'
										className={cx(styles.field, styles.textareaField)}
										error={errors.description}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>Create Tag</FormikSubmitButton>
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
export default AddTagForm