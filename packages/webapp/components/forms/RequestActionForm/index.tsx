/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import cx from 'classnames'
import { Formik, Form, Field } from 'formik'
import { useState, useCallback } from 'react'
import * as Yup from 'yup'
import styles from './index.module.scss'
import IconButton from '~ui/IconButton'

const SignupSchema = Yup.object().shape({
	inputField: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
})

export default function RequestActionForm(): JSX.Element {
	const [focused, setFocus] = useState(false)
	const handleFocus = useCallback((val: boolean) => setFocus(val), [])

	const actions = [
		{
			id: 'add_time',
			label: 'Add Time',
			action: () => {
				console.log('Add Time')
			}
		},
		{
			id: 'add_tag',
			label: 'Add Tag',
			action: () => {
				console.log('Add Tag')
			}
		},
		{
			id: 'add_reminder',
			label: 'Add Reminder',
			action: () => {
				console.log('Add Reminder')
			}
		}
	]

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
				{({ errors, touched }) => {
					const hasError = errors.inputField && touched.inputField
					return (
						<>
							<Form
								className={cx(
									styles.requestActionForm,
									focused && styles.requestActionFormFocused,
									hasError && styles.requestActionFormDanger
								)}
							>
								<div className='p-2'>
									<Field
										onFocus={() => handleFocus(true)}
										onBlur={() => handleFocus(false)}
										className={cx(styles.requestActionFormInput)}
										name='inputField'
										placeholder='Enter text here...'
										component='textarea'
										rows='3'
									/>
								</div>
								<div
									className={cx(
										styles.actionSection,
										'p-2 d-flex justify-content-between align-items-center w-100'
									)}
								>
									<div>
										{actions.map((action, i) => (
											<IconButton
												icon='CircleAdditionSolid'
												key={action.id}
												text={action.label}
												onClick={action.action}
											/>
										))}
									</div>
									<PrimaryButton className='' type='submit'>
										Submit
									</PrimaryButton>
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
