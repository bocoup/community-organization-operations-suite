/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import type ComponentProps from '~types/ComponentProps'
import FormTitle from '~ui/FormTitle'
import FormikField from '~ui/FormikField'

const AddRequestSchema = yup.object().shape({
	inputField: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
})

interface AddRequestFormProps extends ComponentProps {
	title?: string
}

// {
// 	/* Add User */
// }
// {
// 	/* Add Duration */
// }
// {
// 	/* Assign Navigator */
// }
// {
// 	/* Enter Request */
// }

export default function AddRequestForm({ className }: AddRequestFormProps): JSX.Element {
	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					user: '',
					duration: ''
				}}
				validationSchema={AddRequestSchema}
				onSubmit={values => {
					console.log('Form Submit', values)
				}}
			>
				{({ errors, touched }) => {
					return (
						<>
							<Form>
								<FormTitle>New Request</FormTitle>
								{/* Form section with titles within columns */}
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>Add User</FormSectionTitle>
										{/* TODO: make this a react-select field */}
										<FormikField name='user' placeholder='Enter text here...' />
										{/* Handle errors */}
										{errors.user ? <div className='pt-2 text-danger'>{errors.user}</div> : null}
									</Col>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>Add Duration</FormSectionTitle>
										{/* TODO: make this a select or date picker */}
										<FormikField name='duration' placeholder='Enter duration here...' />

										{/* Handle errors */}
										{errors.duration ? (
											<div className='pt-2 text-danger'>{errors.duration}</div>
										) : null}
									</Col>
								</Row>

								{/* Form section with title outside of columns */}
								<FormSectionTitle>Assign Navigator</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										{/* TODO: make this a react-select field */}
										<FormikField name='navigator' placeholder='Enter text here...' />
										{/* Handle errors */}
										{errors.user ? <div className='pt-2 text-danger'>{errors.user}</div> : null}
									</Col>
								</Row>

								<FormikSubmitButton>Create Request</FormikSubmitButton>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
