/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
//import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Engagement } from '@cbosuite/schema/lib/client-types'
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
import FormikField from '~ui/FormikField'
import styles from './index.module.scss'

interface EditRequestFormProps extends ComponentProps {
	title?: string
	engagement: Engagement
	onSubmit?: (form: any) => void
}

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

	const EditRequestSchema = yup.object().shape({
		title: yup.string().required(t('editRequest.fields.required')),
		contactIds: yup.array().required(t('editRequest.fields.required')),
		description: yup.string().required(t('editRequest.fields.required'))
	})

	const onSaveClick = (values: any) => {
		const formData = {
			...values,
			title: values.title,
			engagementId: engagement.id,
			contactIds: values.contactIds,
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
					title: engagement.title,
					contactIds: engagement.contacts.map(contact => {
						return {
							label: `${contact.name.first} ${contact.name.last}`,
							value: contact.id.toString()
						}
					}),
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
						title: values.title,
						tags: values.tags?.map(i => i.value),
						userId: values.userId?.value,
						contactIds: values.contactIds?.map(i => i.value)
					})
				}}
			>
				{({ errors, touched }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
							<Row className='flex-column flex-md-row mb-4'>
								<Col className='mb-3 mb-md-0'>
									<FormSectionTitle>{t('editRequest.fields.requestTitle')}</FormSectionTitle>

									<FormikField
										name='title'
										placeholder={t('editRequest.fields.requestTitle.placeholder')}
										className={cx(styles.field)}
										error={errors.title}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<Row className='flex-column flex-md-row mb-4'>
								<Col className='mb-3 mb-md-0'>
									<FormSectionTitle>{t('editRequest.fields.editClient')}</FormSectionTitle>

									<ClientSelect
										name='contactIds'
										placeholder={t('editRequest.fields.editClient.placeholder')}
									/>
								</Col>
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
