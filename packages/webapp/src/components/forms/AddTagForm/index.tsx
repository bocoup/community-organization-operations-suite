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
import FormTitle from '~ui/FormTitle'
import TagCategorySelect from '~ui/TagCategorySelect'
import FormikSubmitButton from '~ui/FormikSubmitButton'
import FormikField from '~ui/FormikField'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { useTag } from '~hooks/api/useTag'
import { TagInput } from '@cbosuite/schema/dist/client-types'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { reactPlugin } from '~utils/appinsights'

interface AddTagFormProps extends ComponentProps {
	title?: string
	orgId: string
	closeForm?: () => void
}

const AddTagForm = memo(function AddTagForm({
	title,
	orgId,
	className,
	closeForm
}: AddTagFormProps): JSX.Element {
	const { t } = useTranslation('requestTags')
	const { createTag } = useTag()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const NewTagValidationSchema = yup.object().shape({
		label: yup.string().required(t('addTag.yup.required')),
		description: yup.string()
	})

	const handleCreateTag = async (values) => {
		const newTag: TagInput = {
			label: values.label,
			description: values.description,
			category: values.category || undefined
		}

		const response = await createTag(orgId, newTag)
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
export default withAITracking(reactPlugin, AddTagForm)
