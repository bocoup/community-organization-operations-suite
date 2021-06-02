/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import ComponentProps from '~types/ComponentProps'
import ActionInput from '~ui/ActionInput'

const SignupSchema = Yup.object().shape({
	inputField: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
})

export default function RequestActionForm({ className }: ComponentProps): JSX.Element {
	const actions = [
		{
			id: 'add_tag',
			label: 'Add Request Tag',
			action: () => {
				console.log('Add Tag')
			}
		},
		{
			id: 'add_specialist',
			label: 'Add Specialist',
			action: () => {
				console.log('Add Specialist')
			}
		}
	]

	return (
		<div className={cx(className)}>
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
				{({ errors, touched }) => {
					return (
						<>
							<Form>
								<ActionInput error={errors.inputField} actions={actions} showSubmit />
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
