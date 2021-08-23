/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
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
import { useTranslation } from '~hooks/useTranslation'

interface AddRequestFormProps extends ComponentProps {
	onSubmit?: (form: any) => void
	showAssignSpecialist?: boolean
}

const AddRequestForm = memo(function AddRequestForm({
	className,
	onSubmit,
	showAssignSpecialist = true
}: AddRequestFormProps): JSX.Element {
	const { t } = useTranslation('requests')
	const [showAddTag, { setTrue: openAddTag, setFalse: closeAddTag }] = useBoolean(false)
	const actions = [
		{
			id: 'add_tag',
			label: t('addRequest.buttons.addRequestTag'),
			action: () => {
				openAddTag()
			}
		}
	]

	// TODO: move to db under organization or into a constants folder
	const durations = [
		{
			value: '16',
			label: t('addRequest.durations.16hours')
		},
		{
			value: '24',
			label: t('addRequest.durations.1day')
		},
		{
			value: '168',
			label: t('addRequest.durations.1week')
		},
		{
			value: '336',
			label: t('addRequest.durations.2weeks')
		}
	]

	const AddRequestSchema = yup.object().shape({
		contactIds: yup.array().required(t('addRequest.fields.required')),
		duration: yup.string().required(t('addRequest.fields.required')),
		description: yup.string().required(t('addRequest.fields.required'))
	})

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{ userId: null, contactIds: null, tags: null }}
				validationSchema={AddRequestSchema}
				onSubmit={values => {
					const _values = {
						...values,
						tags: values.tags?.map(i => i.value),
						userId: values.userId?.value,
						contactIds: values.contactIds?.map(i => i.value)
					}
					onSubmit?.(_values)
					closeAddTag()
				}}
			>
				{({ errors, touched }) => {
					return (
						<>
							<Form>
								<FormTitle>{t('addRequest.title')}</FormTitle>
								{/* Form section with titles within columns */}
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>{t('addRequest.fields.addClient')}</FormSectionTitle>

										<ClientSelect
											name='contactIds'
											placeholder={t('addRequest.fields.addClient.placeholder')}
										/>
									</Col>
								</Row>
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>{t('addRequest.fields.addDuration')}</FormSectionTitle>

										<FormikSelect
											name='duration'
											placeholder={t('addRequest.fields.addDuration.placeholder')}
											options={durations}
										/>
									</Col>
								</Row>

								{/* Form section with title outside of columns */}
								{showAssignSpecialist && (
									<>
										<FormSectionTitle>
											<>
												{t('addRequest.fields.assignSpecialist')}{' '}
												<span className='text-normal'>({t('addRequest.fields.optional')})</span>
											</>
										</FormSectionTitle>

										<Row className='mb-4 pb-2'>
											<Col>
												<SpecialistSelect
													name='userId'
													placeholder={t('addRequest.fields.assignSpecialist.placeholder')}
												/>
											</Col>
										</Row>
									</>
								)}

								<Row className='mb-4 pb-2'>
									<Col>
										<ActionInput
											name='description'
											error={get(touched, 'description') ? get(errors, 'description') : undefined}
											actions={actions}
										/>

										<FadeIn in={showAddTag} className='mt-3'>
											<TagSelect
												name='tags'
												placeholder={t('addRequest.fields.addTag.placeholder')}
											/>
										</FadeIn>
									</Col>
								</Row>

								<FormikSubmitButton>{t('addRequest.buttons.createRequest')}</FormikSubmitButton>

								{/* Uncomment for debugging */}
								{/* {errors && touched && (
									<ul>
										{Object.keys(errors).map(err => (
											<li>
												{err}: {errors[err]}
											</li>
										))}
									</ul>
								)} */}
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
})

export default AddRequestForm
