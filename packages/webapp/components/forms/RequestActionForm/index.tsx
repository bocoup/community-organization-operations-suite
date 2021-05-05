/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const SignupSchema = Yup.object().shape({
	inputField: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
})

export default function RequestActionForm(): JSX.Element {
	return (
		<div>
			<Formik
				initialValues={{
					inputField: ''
				}}
				validationSchema={SignupSchema}
				onSubmit={values => {
					// same shape as initial values
					console.log('Form Submit', values)
				}}
			>
				{({ errors, touched }) => (
					<Form>
						<Field name='inputField' />
						{errors.inputField && touched.inputField ? <div>{errors.inputField}</div> : null}
						<button type='submit'>Submit</button>
					</Form>
				)}
			</Formik>
		</div>
	)
}
