/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import * as yup from 'yup'
import type { StandardFC } from '~types/StandardFC'
import { Formik, Form } from 'formik'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormTitle } from '~ui/FormTitle'
import { TagCategorySelect } from '~ui/TagCategorySelect'
import { FormikSubmitButton } from '~ui/FormikSubmitButton'
import { FormikField } from '~ui/FormikField'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useTag } from '~hooks/api/useTag'
import type { TagInput } from '@cbosuite/schema/dist/client-types'
import { useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap, trackEvent } from '~utils/appinsights'
import { noop } from '~utils/noop'

interface AddTagFormProps {
	title?: string
	orgId: string
	closeForm?: () => void
}

export const AddTagForm: StandardFC<AddTagFormProps> = wrap(function AddTagForm({
	title,
	orgId,
	className,
	closeForm = noop
}) {
	const { t } = useTranslation(Namespace.Tags)
	const { createTag } = useTag()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const NewTagValidationSchema = yup.object().shape({
		label: yup.string().required(t('addTag.yup.required')),
		description: yup.string()
	})

	const handleCreateTag = async (values) => {
		const newTag: TagInput = {
			orgId,
			label: values.label,
			description: values.description,
			category: values.category || undefined
		}

		try {
			await createTag(newTag)
			setSubmitMessage(null)
			trackEvent({
				name: 'Create Tag',
				properties: {
					'Organization ID': newTag.orgId,
					Category: newTag.category ?? ''
				}
			})
			closeForm()
		} catch (error) {
			setSubmitMessage(error?.message)
		}
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					label: '',
					description: ''
				}}
				validationSchema={NewTagValidationSchema}
				onSubmit={handleCreateTag}
			>
				{({ values, errors }) => {
					return (
						<Form>
							<FormTitle>{title}</FormTitle>
							<FormSectionTitle className='mt-5'>{t('addTag.tagInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='label'
										placeholder={t('addTag.tagPlaceholder')}
										className={cx(styles.field)}
										error={errors.label as string}
										errorClassName={cx(styles.errorLabel)}
									/>

									<TagCategorySelect
										name='category'
										className={'mb-3'}
										placeholder={t('addTag.categoryPlaceholder')}
									/>

									<FormikField
										as='textarea'
										name='description'
										placeholder={t('addTag.descriptionPlaceholder')}
										className={cx(styles.field, styles.textareaField)}
										error={errors.description as string}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>{t('addTag.buttons.createTag')}</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									{t('addTag.submitMessage.failed')}
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
