/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import { REQUEST_DURATIONS } from '~constants'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import type { StandardFC } from '~types/StandardFC'
import { ClientSelect } from '~ui/ClientSelect'
import { FormTitle } from '~ui/FormTitle'
import { FormikSelect } from '~ui/FormikSelect'
import { SpecialistSelect } from '~ui/SpecialistSelect'
import { useBoolean } from '@fluentui/react-hooks'
import { ActionInput } from '~ui/ActionInput'
import { FadeIn } from '~ui/FadeIn'
import { TagSelect } from '~ui/TagSelect'
import { get } from 'lodash'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormikField } from '~ui/FormikField'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'

interface AddRequestFormProps {
	onSubmit: (form: any) => void
	showAssignSpecialist?: boolean
}

export const AddRequestForm: StandardFC<AddRequestFormProps> = wrap(function AddRequestForm({
	className,
	onSubmit,
	showAssignSpecialist = true
}) {
	const { t } = useTranslation(Namespace.Requests)
	const [showAddTag, { setTrue: openAddTag, setFalse: closeAddTag }] = useBoolean(false)
	const actions = [
		{
			id: 'add_tag',
			label: t('addRequestButtons.addRequestTag'),
			action: () => {
				openAddTag()
			}
		}
	]
	const durations = useMemo(() => REQUEST_DURATIONS.map((d) => ({ ...d, label: t(d.label) })), [t])

	const AddRequestSchema = yup.object().shape({
		title: yup
			.string()
			.min(2, t('addRequestYup.tooShort'))
			.max(50, t('addRequestYup.tooLong'))
			.required(t('addRequestYup.required')),
		contactIds: yup.array().min(1, t('addRequestYup.required')),
		duration: yup.string().required(t('addRequestYup.required')),
		description: yup.string().required(t('addRequestYup.required'))
	})

	return (
		<div className={cx(className, 'addRequestForm')}>
			<Formik
				validateOnBlur
				initialValues={{
					title: '',
					userId: null,
					contactIds: [],
					tags: null,
					duration: null,
					description: ''
				}}
				validationSchema={AddRequestSchema}
				onSubmit={(values) => {
					const _values = {
						...values,
						title: values.title,
						tags: values.tags?.map((i) => i.value),
						userId: values.userId?.value,
						contactIds: values.contactIds?.map((i) => i.value)
					}
					onSubmit(_values)
					closeAddTag()
				}}
			>
				{({ errors, touched, values }) => {
					return (
						<>
							<Form>
								<FormTitle>{t('addRequestTitle')}</FormTitle>
								{/* Form section with titles within columns */}
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>{t('addRequestFields.requestTitle')}</FormSectionTitle>

										<FormikField
											name='title'
											placeholder={t('addRequestFields.requestTitlePlaceholder')}
											className={cx(styles.field, 'requestTitleInput')}
											error={errors.title}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>{t('addRequestFields.addClient')}</FormSectionTitle>

										<ClientSelect
											name='contactIds'
											className='requestClientSelect'
											placeholder={t('addRequestFields.addClientPlaceholder')}
											errorClassName={cx(styles.errorLabel, styles.errorLabelContactIds)}
										/>
									</Col>
								</Row>
								<Row className='flex-column flex-md-row mb-4'>
									<Col className='mb-3 mb-md-0'>
										<FormSectionTitle>{t('addRequestFields.addDuration')}</FormSectionTitle>

										<FormikSelect
											name='duration'
											className='requestDurationSelect'
											placeholder={t('addRequestFields.addDurationPlaceholder')}
											options={durations}
										/>
									</Col>
								</Row>

								{/* Form section with title outside of columns */}
								{showAssignSpecialist && (
									<>
										<FormSectionTitle>
											<>
												{t('addRequestFields.assignSpecialist')}{' '}
												<span className='text-normal'>({t('addRequestFields.optional')})</span>
											</>
										</FormSectionTitle>

										<Row className='mb-4 pb-2'>
											<Col>
												<SpecialistSelect
													name='userId'
													className={'requestSpecialistSelect'}
													placeholder={t('addRequestFields.assignSpecialistPlaceholder')}
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
												placeholder={t('addRequestFields.addTagPlaceholder')}
											/>
										</FadeIn>
									</Col>
								</Row>

								<FormikSubmitButton
									className='btnAddRequestSubmit'
									disabled={
										!touched ||
										!values.contactIds?.length ||
										!values.title?.length ||
										!values.duration?.length ||
										!values.description?.length
									}
								>
									{t('addRequestButtons.createRequest')}
								</FormikSubmitButton>

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
