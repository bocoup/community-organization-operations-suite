/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useState } from 'react'
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import { IconButton } from '~ui/IconButton'
import type { StandardFC } from '~types/StandardFC'
import { ClientSelect } from '~ui/ClientSelect'
import { FormTitle } from '~ui/FormTitle'
import { SpecialistSelect } from '~ui/SpecialistSelect'
import { useBoolean } from '@fluentui/react-hooks'
import { DatePicker } from '@fluentui/react'
import { ActionInput } from '~ui/ActionInput'
import { FadeIn } from '~ui/FadeIn'
import { TagSelect } from '~ui/TagSelect'
import { get } from 'lodash'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { FormikField } from '~ui/FormikField'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { NewFormPanel } from '~components/ui/NewFormPanel'
import { useLocale } from '~hooks/useLocale'

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
	const [locale] = useLocale()
	const actions = [
		{
			id: 'add_tag',
			label: t('addRequestButtons.addRequestTag'),
			action: () => {
				openAddTag()
			}
		}
	]

	const AddRequestSchema = yup.object().shape({
		title: yup
			.string()
			.min(2, t('addRequestYup.tooShort'))
			.max(50, t('addRequestYup.tooLong'))
			.required(t('addRequestYup.required')),
		contactIds: yup.array().min(1, t('addRequestYup.required')),
		description: yup.string().required(t('addRequestYup.required'))
	})

	const [openNewClientFormPanel, setOpenNewClientFormPanel] = useState(false)

	return (
		<div className={cx(className, 'addRequestForm')}>
			<Formik
				validateOnBlur
				initialValues={{
					title: '',
					userId: null,
					contactIds: [],
					endDate: null,
					tags: null,
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
				{({ errors, touched, values, setFieldValue }) => {
					return (
						<>
							<NewFormPanel
								showNewFormPanel={openNewClientFormPanel}
								newFormPanelName={'addClientForm'}
								onNewFormPanelDismiss={() => setOpenNewClientFormPanel(false)}
							/>
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
								<Row className='flex-column flex-md-row mb-0'>
									<FormSectionTitle>{t('addRequestFields.addClient')}</FormSectionTitle>
								</Row>
								<Row className='flex-row flex-nowrap mb-4'>
									<Col className='mb-3 mb-md-0'>
										<ClientSelect
											name='contactIds'
											className='requestClientSelect'
											placeholder={t('addRequestFields.addClientPlaceholder')}
											errorClassName={cx(styles.errorLabel, styles.errorLabelContactIds)}
										/>
									</Col>
									<Col xs={2} md={1} className='mb-3 mb-md-0'>
										<IconButton
											icon='CircleAdditionSolid'
											className='btnAddItem'
											title={t('requestPageTopButtons.newClientTitle')}
											onClick={() => setOpenNewClientFormPanel(true)}
										/>
									</Col>
								</Row>
								<Row className='flex-column flex-md-row mb-4'>
									<Col>
										<FormSectionTitle>
											<>
												{t('addRequestFields.addEndDate')}{' '}
												<span className='text-normal'>({t('addRequestFields.optional')})</span>
											</>
										</FormSectionTitle>

										<DatePicker
											placeholder={t('addRequestFields.addEndDatePlaceholder')}
											allowTextInput
											showMonthPickerAsOverlay={false}
											ariaLabel={t('formElements.datePickerAriaLabel')}
											value={values.endDate ? new Date(values.endDate) : null}
											onSelectDate={(date) => {
												setFieldValue('endDate', date)
											}}
											formatDate={(date) => date.toLocaleDateString(locale)}
											minDate={new Date()}
											styles={{
												root: {
													border: 0,
													padding: '0 !important'
												},
												wrapper: {
													border: 0
												},
												textField: {
													border: '1px solid var(--bs-gray-4)',
													borderRadius: '3px',
													minHeight: '35px',
													//paddingTop: 4,
													selectors: {
														'.ms-TextField-fieldGroup': {
															border: 0,
															height: '41px',
															':after': {
																outline: 0,
																border: 0
															}
														},
														i: {
															top: '5px'
														},
														span: {
															div: {
																marginTop: 0
															}
														}
													},
													':focus': {
														borderColor: 'var(--bs-primary-light)'
													},
													':active': {
														borderColor: 'var(--bs-primary-light)'
													},
													':hover': {
														borderColor: 'var(--bs-primary-light)'
													}
												}
											}}
											//className={cx(styles.field)}
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
