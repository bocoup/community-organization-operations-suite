/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FadeIn from '~ui/FadeIn'
import FormProps from '~types/FormProps'
import ActionInput from '~ui/ActionInput'
import TagSelect from '~ui/TagSelect'
import SpecialistSelect from '~ui/SpecialistSelect'
import { get } from 'lodash'
import { memo } from 'react'
import { useTranslation } from 'next-i18next'

const RequestActionForm = memo(function RequestActionForm({
	className,
	onSubmit
}: FormProps): JSX.Element {
	const { t } = useTranslation('requests')
	const [showAddTag, { setTrue: openAddTag, setFalse: closeAddTag }] = useBoolean(false)
	const [showAddSpecialist, { setTrue: openAddSpecialist, setFalse: closeAddSpecialist }] =
		useBoolean(false)

	const RequestActionFormSchema = Yup.object().shape({
		comment: Yup.string()
			.min(2, t('viewRequest.body.yup.tooShort'))
			.max(50, t('viewRequest.body.yup.tooLong'))
			.required(t('viewRequest.body.yup.required'))
	})

	const actions = [
		{
			id: 'add_tag',
			label: t('viewRequest.body.actions.addTag'),
			action: () => {
				openAddTag()
			}
		},
		{
			id: 'add_specialist',
			label: t('viewRequest.body.actions.addSpecialist'),
			action: () => {
				openAddSpecialist()
			}
		}
	]

	return (
		<div className={cx(className)}>
			<Formik
				initialValues={{
					comment: '',
					taggedUserId: null,
					tags: []
				}}
				validationSchema={RequestActionFormSchema}
				onSubmit={(values, { resetForm }) => {
					const formValues = {
						...values,
						tags: values?.tags.map(i => i.value),
						taggedUserId: values?.taggedUserId?.value
					}

					onSubmit?.(formValues)
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
									error={touched ? get(errors, 'comment') : undefined}
									actions={actions}
									showSubmit
								/>

								<FadeIn in={showAddTag} className='mt-3'>
									<TagSelect name='tags' placeholder={t('viewRequest.body.addTag.placeholder')} />
								</FadeIn>

								<FadeIn in={showAddSpecialist} className='mt-3'>
									<SpecialistSelect
										name='taggedUserId'
										placeholder={t('viewRequest.body.assignTo.placeholder')}
									/>
								</FadeIn>
							</Form>
						</>
					)
				}}
			</Formik>
		</div>
	)
})
export default RequestActionForm
