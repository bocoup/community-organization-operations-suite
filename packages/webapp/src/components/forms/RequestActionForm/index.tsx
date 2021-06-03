/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import FadeIn from '~ui/FadeIn'
import FormProps from '~types/FormProps'
import ActionInput from '~ui/ActionInput'
import SpecialistSelect from '~ui/SpecialistSelect'

const SignupSchema = Yup.object().shape({
	comment: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required')
})

export default function RequestActionForm({ className, onSubmit }: FormProps): JSX.Element {
	const [showAddTag, { setTrue: openAddTag, setFalse: closeAddTag }] = useBoolean(false)
	const [
		showAddSpecialist,
		{ setTrue: openAddSpecialist, setFalse: closeAddSpecialist }
	] = useBoolean(false)

	const actions = [
		{
			id: 'add_tag',
			label: 'Add Request Tag',
			action: () => {
				openAddTag()
			}
		},
		{
			id: 'add_specialist',
			label: 'Add Specialist',
			action: () => {
				openAddSpecialist()
			}
		}
	]

	return (
		<div className={cx(className)}>
			<Formik
				initialValues={{
					comment: ''
				}}
				validationSchema={SignupSchema}
				onSubmit={(values, { resetForm }) => {
					onSubmit?.(values)
					closeAddTag()
					closeAddSpecialist()
					resetForm()
				}}
			>
				{({ errors, touched }) => {
					return (
						<>
							<Form>
								<ActionInput
									name='comment'
									error={touched ? errors.comment : undefined}
									actions={actions}
									showSubmit
								/>

								<FadeIn in={showAddSpecialist} className='mt-3'>
									<SpecialistSelect name='taggedUserId' placeholder='Assign to specialist...' />
								</FadeIn>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
