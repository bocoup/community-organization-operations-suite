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
import ClientSelect from '~ui/ClientSelect'
import FormTitle from '~ui/FormTitle'
import FormikSelect from '~ui/FormikSelect'
import SpecialistSelect from '~ui/SpecialistSelect'
import { useBoolean } from '@fluentui/react-hooks'
import ActionInput from '~ui/ActionInput'
import FadeIn from '~ui/FadeIn'
import TagSelect from '~ui/TagSelect'
import { get } from 'lodash'

const AddRequestSchema = yup.object().shape({
	userId: yup.string().required('Required'),
	duration: yup.string().required('Required'),
	description: yup.string().required('Required')
})

interface AddRequestFormProps extends ComponentProps {
	onSubmit?: (form: any) => void
}

// TODO: move to db under organization or into a constants folder
const durations = [
	{
		value: '16',
		label: '16 hours'
	},
	{
		value: '24',
		label: '1 day'
	},
	{
		value: '168',
		label: '1 week'
	},
	{
		value: '336',
		label: '2 weeks'
	}
]

export default function AddRequestForm({ className, onSubmit }: AddRequestFormProps): JSX.Element {
	const [showAddTag, { setTrue: openAddTag, setFalse: closeAddTag }] = useBoolean(false)
	const actions = [
		{
			id: 'add_tag',
			label: 'Add Request Tag',
			action: () => {
				openAddTag()
			}
		}
	]

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{}}
				validationSchema={AddRequestSchema}
				onSubmit={values => {
					console.log('on submit in add request form')

					onSubmit?.(values)
					closeAddTag()
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
										{/* <FormikField name='user' placeholder='Enter text here...' /> */}
										<ClientSelect name='contactId' placeholder='Enter text here...' />
									</Col>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>Add Duration</FormSectionTitle>
										{/* TODO: make this a select or date picker */}
										<FormikSelect
											name='duration'
											placeholder='Enter duration here...'
											options={durations}
										/>
									</Col>
								</Row>

								{/* Form section with title outside of columns */}
								<FormSectionTitle>
									<>
										Assign Specialist <span className='text-normal'>(Optional)</span>
									</>
								</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<SpecialistSelect name='userId' placeholder='Search or Create...' />
									</Col>
								</Row>

								<Row className='mb-4 pb-2'>
									<Col>
										<ActionInput
											name='description'
											error={touched ? get(errors, 'description') : undefined}
											actions={actions}
										/>

										<FadeIn in={showAddTag} className='mt-3'>
											<TagSelect name='tags' placeholder='Add tag...' />
										</FadeIn>
									</Col>
								</Row>

								{/* <button type='submit'>Create Request</button> */}
								<FormikSubmitButton>Create Request</FormikSubmitButton>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
}
