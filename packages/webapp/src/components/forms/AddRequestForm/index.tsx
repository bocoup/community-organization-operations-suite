/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import type ComponentProps from '~types/ComponentProps'

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
			<h3>New Request</h3>
			<Formik
				validateOnBlur
				initialValues={{
					inputField: ''
				}}
				validationSchema={AddRequestSchema}
				onSubmit={values => {
					console.log('Form Submit', values)
				}}
			>
				{({ errors, touched }) => {
					const hasError = errors.inputField && touched.inputField
					return (
						<>
							<Form>
								<div className='p-2'>
									<Field name='inputField' placeholder='Enter text here...' />
								</div>
							</Form>
							{/* Handle errors */}
							{hasError ? <div className='p-2 px-3 text-danger'>{errors.inputField}</div> : null}
						</>
					)
				}}
			</Formik>
		</div>
	)
}
