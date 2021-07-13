/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
//import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Engagement } from '@resolve/schema/lib/client-types'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormTitle from '~components/ui/FormTitle'
import ClientSelect from '~ui/ClientSelect'
//import FormikSelect from '~ui/FormikSelect'
import SpecialistSelect from '~ui/SpecialistSelect'
import ActionInput from '~ui/ActionInput'
import FadeIn from '~ui/FadeIn'
import TagSelect from '~ui/TagSelect'
import { get } from 'lodash'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface EditRequestFormProps extends ComponentProps {
	title?: string
	engagement: Engagement
	onSubmit?: (form: any) => void
}

const EditRequestSchema = yup.object().shape({
	contactId: yup.object().required('Required'),
	//duration: yup.string().required('Required'),
	description: yup.string().required('Required')
})

// TODO: move to db under organization or into a constants folder
// const durations = [
// 	{
// 		value: '16',
// 		label: '16 hours'
// 	},
// 	{
// 		value: '24',
// 		label: '1 day'
// 	},
// 	{
// 		value: '168',
// 		label: '1 week'
// 	},
// 	{
// 		value: '336',
// 		label: '2 weeks'
// 	}
// ]

const EditRequestForm = memo(function EditRequestForm({
	title,
	className,
	engagement,
	onSubmit
}: EditRequestFormProps): JSX.Element {
	const { t } = useTranslation('requests')
	const formTitle = title || t('editRequest.title')

	const onSaveClick = (values: any) => {
		const formData = {
			...values,
			engagementId: engagement.id,
			contactId: values.contactId,
			userId: values.userId,
			tags: values.tags
		}

		onSubmit?.(formData)
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					contactId: {
						label: `${engagement.contact.name.first} ${engagement.contact.name.last}`,
						value: engagement.contact.id.toString()
					},
					description: engagement.description || '',
					userId: engagement?.user
						? {
								label: `${engagement.user.name.first} ${engagement.user.name.last}`,
								value: engagement.user.id.toString()
						  }
						: {},
					tags: engagement.tags.map(tag => {
						return {
							label: tag.label,
							value: tag.id
						}
					})
				}}
				validationSchema={EditRequestSchema}
				onSubmit={values => {
					onSaveClick({
						...values,
						tags: values.tags?.map(i => i.value),
						userId: values.userId?.value,
						contactId: values.contactId?.value
					})
				}}
			>
				{({ errors, touched }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
							<Row className='flex-column flex-md-row mb-4'>
								<Col className='mb-3 mb-md-0'>
									<FormSectionTitle>{t('editRequest.fields.editClient')}</FormSectionTitle>

									<ClientSelect
										name='contactId'
										placeholder={t('editRequest.fields.editClient.placeholder')}
									/>
								</Col>

								{/* <Col className='mb-3 mb-md-0'>
									<FormSectionTitle>Request Duration</FormSectionTitle>

									<FormikSelect
										name='duration'
										placeholder='Enter duration here...'
										options={durations}
									/>
								</Col> */}
							</Row>
							<FormSectionTitle>
								<>
									{t('editRequest.fields.assignSpecialist')}{' '}
									<span className='text-normal'>({t('editRequest.fields.optional')})</span>
								</>
							</FormSectionTitle>

							<Row className='mb-4 pb-2'>
								<Col>
									<SpecialistSelect
										name='userId'
										placeholder={t('editRequest.fields.assignSpecialist.placeholder')}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormSectionTitle>{t('editRequest.fields.description')}</FormSectionTitle>
									<ActionInput
										name='description'
										error={get(touched, 'description') ? get(errors, 'description') : undefined}
										className='mb-4'
									/>
									<FadeIn in={true}>
										<TagSelect
											name='tags'
											placeholder={t('editRequest.fields.addTag.placeholder')}
										/>
									</FadeIn>
								</Col>
							</Row>

							<FormikSubmitButton>{t('editRequest.buttons.save')}</FormikSubmitButton>
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
export default EditRequestForm
