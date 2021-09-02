/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withAITracking } from '@microsoft/applicationinsights-react-js'
import styles from './index.module.scss'
import * as yup from 'yup'
import type ComponentProps from '~types/ComponentProps'
import { Formik, Form } from 'formik'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import FormikField from '~ui/FormikField'
import TagCategorySelect from '~ui/TagCategorySelect'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useTag } from '~hooks/api/useTag'
import { TagInput } from '@cbosuite/schema/dist/client-types'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { reactPlugin } from '~utils/appinsights'

interface EditTagFormProps extends ComponentProps {
	title?: string
	orgId: string
	tag: TagInput
	closeForm?: () => void
}

const EditTagForm = memo(function EditTagForm({
	title,
	orgId,
	tag,
	className,
	closeForm
}: EditTagFormProps): JSX.Element {
	const { t } = useTranslation('requestTags')
	const { updateTag } = useTag()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const EditTagValidationSchema = yup.object().shape({
		label: yup.string().required(t('editTag.yup.required')),
		description: yup.string()
	})

	const handleUpdateTag = async (values) => {
		const updatedTag: TagInput = {
			id: tag.id,
			label: values.label,
			description: values.description,
			category: values.category
		}

		const response = await updateTag(orgId, updatedTag)
		if (response.status === 'success') {
			setSubmitMessage(null)
			closeForm?.()
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
export default withAITracking(reactPlugin, EditTagForm)
