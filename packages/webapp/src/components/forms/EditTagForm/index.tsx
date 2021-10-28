/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import * as yup from 'yup'
import type { StandardFC } from '~types/StandardFC'
import { Formik, Form } from 'formik'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormTitle } from '~components/ui/FormTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import { FormikField } from '~ui/FormikField'
import { TagCategorySelect } from '~ui/TagCategorySelect'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useTag } from '~hooks/api/useTag'
import { TagInput } from '@cbosuite/schema/dist/client-types'
import { useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { StatusType } from '~hooks/api'

interface EditTagFormProps {
	title?: string
	tag: TagInput
	closeForm?: () => void
}

export const EditTagForm: StandardFC<EditTagFormProps> = wrap(function EditTagForm({
	title,
	tag,
	className,
	closeForm = noop
}) {
	const { t } = useTranslation('tags')
	const { updateTag } = useTag()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const EditTagValidationSchema = yup.object().shape({
		label: yup.string().required(t('editTag.yup.required')),
		description: yup.string()
	})

	const handleUpdateTag = async (values) => {
		const updatedTag: TagInput = {
			id: tag.id,
			orgId: tag.orgId,
			label: values.label,
			description: values.description,
			category: values.category
		}

		const response = await updateTag(updatedTag)
		if (response.status === StatusType.Success) {
			setSubmitMessage(null)
			closeForm()
		} else {
			setSubmitMessage(response.message)
		}
	}

	return (
		<div className={cx(className)}>
			<Formik
				validateOnBlur
				initialValues={{
					label: tag.label,
					description: tag.description || '',
					category: tag.category
				}}
				validationSchema={EditTagValidationSchema}
				onSubmit={(values) => {
					handleUpdateTag(values)
				}}
			>
				{({ errors }) => {
					return (
						<Form>
							<FormTitle>{title}</FormTitle>
							<FormSectionTitle className='mt-5'>{t('editTag.tagInfo')}</FormSectionTitle>
							<Row className='mb-4 pb-2'>
								<Col>
									<FormikField
										name='label'
										placeholder={t('editTag.tagPlaceholder')}
										className={cx(styles.field)}
										error={errors.label}
										errorClassName={cx(styles.errorLabel)}
									/>

									<TagCategorySelect
										name='category'
										className={'mb-3'}
										defaultValue={tag.category}
										placeholder={t('addTag.categoryPlaceholder')}
									/>

									<FormikField
										as='textarea'
										name='description'
										placeholder={t('editTag.descriptionPlaceholder')}
										className={cx(styles.field, styles.textareaField)}
										error={errors.description}
										errorClassName={cx(styles.errorLabel)}
									/>
								</Col>
							</Row>
							<FormikSubmitButton>{t('editTag.buttons.save')}</FormikSubmitButton>
							{submitMessage && (
								<div className={cx('mt-5 alert alert-danger')}>
									{t('editTag.submitMessage.failed')}
								</div>
							)}
						</Form>
					)
				}}
			</Formik>
		</div>
	)
})
