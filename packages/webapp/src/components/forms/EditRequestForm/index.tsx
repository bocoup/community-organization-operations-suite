/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as yup from 'yup'
import cx from 'classnames'
import { get } from 'lodash'
import { Formik, Form } from 'formik'

import { Col, Row } from 'react-bootstrap'
import styles from './index.module.scss'

import type { StandardFC } from '~types/StandardFC'
import { Engagement } from '@cbosuite/schema/dist/client-types'

import { ActionInput } from '~components/ui/ActionInput'
import { ClientSelect } from '~components/ui/ClientSelect'
import { FadeIn } from '~components/ui/FadeIn'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormTitle } from '~components/ui/FormTitle'
import { FormikField } from '~components/ui/FormikField'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import { SpecialistSelect } from '~components/ui/SpecialistSelect'
import { TagSelect } from '~components/ui/TagSelect'

import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'

interface EditRequestFormProps {
	title?: string
	engagement: Engagement
	onSubmit?: (form: any) => void
}

export const EditRequestForm: StandardFC<EditRequestFormProps> = wrap(function EditRequestForm({
	title,
	className,
	engagement,
	onSubmit = noop
}) {
	const { t } = useTranslation(Namespace.Requests)
	const formTitle = title || t('editRequestTitle')

	const EditRequestSchema = yup.object().shape({
		title: yup
			.string()
			.min(2, t('editRequestYup.tooShort'))
			.max(200, t('editRequestYup.tooLong'))
			.required(t('editRequestYup.required')),
		contactIds: yup.array().min(1, t('editRequestYup.required')),
		description: yup.string().required(t('editRequestYup.required'))
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

		onSubmit(formData)
	}

	const handleFormSubmit = (values) => {
		onSaveClick({
			...values,
			title: values.title,
			tags: values.tags?.map((i) => i.value),
			userId: values.userId?.value,
			contactIds: values.contactIds?.map((i) => i.value)
		})
	}

	const initialValues = {
		title: engagement.title,
		contactIds: engagement.contacts.map((contact) => {
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
		tags: engagement.tags.map((tag) => {
			return {
				label: tag.label,
				value: tag.id
			}
		})
	}

	return (
		<div className={cx(className)}>
			<Formik
				initialValues={initialValues}
				onSubmit={handleFormSubmit}
				validateOnBlur
				validationSchema={EditRequestSchema}
			>
				{({ errors, touched }) => {
					return (
						<Form>
							<FormTitle>{formTitle}</FormTitle>
							<Row className='flex-column flex-md-row mb-4'>
								<Col className='mb-3 mb-md-0'>
									<FormSectionTitle>{t('editRequestFields.requestTitle')}</FormSectionTitle>
									<FormikField
										name='title'
										placeholder={t('editRequestFields.requestTitlePlaceholder')}
										className={cx(styles.field)}
										error={errors?.title?.toString()}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<Row className='flex-column flex-md-row mb-4'>
								<Col className='mb-3 mb-md-0'>
									<FormSectionTitle>{t('editRequestFields.editClient')}</FormSectionTitle>

									<ClientSelect
										name='contactIds'
										placeholder={t('editRequestFields.editClientPlaceholder')}
										errorClassName={cx(styles.errorLabel, styles.errorLabelContactIds)}
									/>
								</Col>
							</Row>
							<FormSectionTitle>
								<>
									{t('editRequestFields.assignSpecialist')}{' '}
									<span className='text-normal'>({t('editRequestFields.optional')})</span>
								</>
							</FormSectionTitle>

							<Row className='mb-4 pb-2'>
								<Col>
									<SpecialistSelect
										name='userId'
										placeholder={t('editRequestFields.assignSpecialistPlaceholder')}
									/>
								</Col>
							</Row>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormSectionTitle>{t('editRequestFields.description')}</FormSectionTitle>
									<ActionInput
										name='description'
										error={get(touched, 'description') ? get(errors, 'description') : undefined}
										className='mb-4'
									/>
									<FadeIn in={true}>
										<TagSelect name='tags' placeholder={t('editRequestFields.addTagPlaceholder')} />
									</FadeIn>
								</Col>
							</Row>

							<FormikSubmitButton>{t('editRequestButtons.save')}</FormikSubmitButton>
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
