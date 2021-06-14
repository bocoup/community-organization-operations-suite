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

interface AddTagFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const NewTagValidationSchema = yup.object().shape({
	label: yup.string().required('Required'),
	description: yup.string()
})

export default function AddTagForm({ title, className, closeForm }: AddTagFormProps): JSX.Element {
	const handleCreateTag = values => {
		console.log('creating tag...', values)
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
						</Form>
					)
				}}
			</Formik>
		</div>
	)
}
