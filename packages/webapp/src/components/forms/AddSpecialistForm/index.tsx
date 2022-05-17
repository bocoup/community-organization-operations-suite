/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import styles from './index.module.scss'
import { FormSectionTitle } from '~components/ui/FormSectionTitle'
import { FormTitle } from '~components/ui/FormTitle'
import { FormikSubmitButton } from '~components/ui/FormikSubmitButton'
import type { StandardFC } from '~types/StandardFC'
import { FormikField } from '~ui/FormikField'
import { useSpecialist } from '~hooks/api/useSpecialist'
import type { UserInput, RoleTypeInput } from '@cbosuite/schema/dist/client-types'
import { RoleType } from '@cbosuite/schema/dist/client-types'
import { useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { StatusType } from '~hooks/api'
import { OfflineEntityCreationNotice } from '~components/ui/OfflineEntityCreationNotice'

interface AddSpecialistFormProps {
	title?: string
	closeForm?: () => void
}
const INITIAL_FORM_VALUES = {
	firstName: '',
	lastName: '',
	userName: '',
	email: '',
	phone: '',
	admin: false
}

export const AddSpecialistForm: StandardFC<AddSpecialistFormProps> = wrap(
	function AddSpecialistForm({ title, className, closeForm = noop }) {
		const { t } = useTranslation(Namespace.Specialists)
		const formTitle = title || t('addSpecialist.title')
		const { createSpecialist } = useSpecialist()
		const { orgId } = useCurrentUser()
		const [submitMessage, setSubmitMessage] = useState<string | null>(null)
		const [submitValues, setSubmitValues] = useState(INITIAL_FORM_VALUES)

		const NewNavigatorValidationSchema = yup.object().shape({
			firstName: yup
				.string()
				.min(2, t('addSpecialist.yup.tooShort'))
				.max(25, t('addSpecialist.yup.tooLong'))
				.required(t('addSpecialist.yup.required')),
			lastName: yup
				.string()
				.min(2, t('addSpecialist.yup.tooShort'))
				.max(25, t('addSpecialist.yup.tooLong'))
				.required(t('addSpecialist.yup.required')),
			userName: yup
				.string()
				.min(2, t('addSpecialist.yup.tooShort'))
				.max(20, t('addSpecialist.yup.tooLong'))
				.required(t('addSpecialist.yup.required')),
			email: yup
				.string()
				.email(t('addSpecialist.yup.invalidEmail'))
				.required(t('addSpecialist.yup.required'))
				.test('new-email', t('addSpecialist.yup.emailExist'), (value) => !testEmailExists(value)),
			phone: yup.string()
		})

		const testEmailExists = (email: string) => {
			if (submitMessage === null) return false
			if (submitMessage.includes('EMAIL_EXIST')) {
				return email === submitValues.email
			}
			return false
		}

		const handleCreateSpecialist = async (values) => {
			const defaultRoles: RoleTypeInput[] = [
				{
					orgId: orgId,
					roleType: RoleType.User
				}
			]

			if (values.admin) {
				defaultRoles.push({ orgId: orgId, roleType: RoleType.Admin })
			}

			const newUser: UserInput = {
				first: values.firstName,
				last: values.lastName,
				userName: values.userName,
				email: values.email,
				phone: values.phone,
				roles: defaultRoles
			}

			const response = await createSpecialist(newUser)

			if (response.status === StatusType.Success) {
				setSubmitMessage(null)
				setSubmitValues(INITIAL_FORM_VALUES)
				closeForm()
			} else {
				setSubmitMessage(response.message)
				setSubmitValues(values)
			}
		}

		return (
			<div className={cx(className)}>
				<Formik
					validateOnBlur
					initialValues={INITIAL_FORM_VALUES}
					validationSchema={NewNavigatorValidationSchema}
					onSubmit={async (values, actions) => {
						await handleCreateSpecialist(values)
						actions.validateForm()
					}}
				>
					{({ values, errors }) => {
						return (
							<>
								<Form>
									<FormTitle>
										{!values.firstName || !values.lastName
											? formTitle
											: `${values.firstName} ${values.lastName}`}
									</FormTitle>
									<OfflineEntityCreationNotice />
									<FormSectionTitle className='mt-5'>
										{t('addSpecialist.fields.specialistInfo')}
									</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='firstName'
												placeholder={t('addSpecialist.fields.firstNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.firstName}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormikField
												name='lastName'
												placeholder={t('addSpecialist.fields.lastNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.lastName}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>
									<FormSectionTitle>{t('addSpecialist.fields.userNameInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='userName'
												placeholder={t('addSpecialist.fields.userNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.userName}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>
									<FormSectionTitle>{t('addSpecialist.fields.adminRoleInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col className={cx(styles.checkBox)}>
											<FormikField name='admin' type='checkbox' className={cx(styles.field)} />
											<span>{t('addSpecialist.fields.adminRolePlaceholder')}</span>
										</Col>
									</Row>
									<FormSectionTitle>{t('addSpecialist.fields.addContactInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='email'
												placeholder={t('addSpecialist.fields.emailPlaceholder')}
												className={cx(styles.field)}
												error={errors.email}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormikField
												name='phone'
												placeholder={t('addSpecialist.fields.phonePlaceholder')}
												className={cx(styles.field)}
												error={errors.phone as string}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>

									<FormikSubmitButton>
										{t('addSpecialist.buttons.createSpecialist')}
									</FormikSubmitButton>
									{submitMessage && (
										<div className={cx('mt-5 alert alert-danger')}>
											{t('addSpecialist.submitMessage.failed')}
										</div>
									)}
								</Form>
							</>
						)
					}}
				</Formik>
			</div>
		)
	}
)
