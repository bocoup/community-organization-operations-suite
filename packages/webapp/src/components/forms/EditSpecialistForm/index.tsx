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
import { DeleteSpecialistModal } from '~components/ui/DeleteSpecialistModal'
import { FormikButton } from '~components/ui/FormikButton'
import type { StandardFC } from '~types/StandardFC'
import { FormikField } from '~ui/FormikField'
import {
	RoleType,
	RoleTypeInput,
	StatusType,
	User,
	UserInput
} from '@cbosuite/schema/dist/client-types'
import { useAuthUser } from '~hooks/api/useAuth'
import { useState } from 'react'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { MessageResponse } from '~hooks/api'
import { noop } from '~utils/noop'

interface EditSpecialistFormProps {
	title?: string
	specialist: User
	closeForm?: () => void
}

export const EditSpecialistForm: StandardFC<EditSpecialistFormProps> = wrap(
	function EditSpecialistForm({ title, className, specialist, closeForm = noop }) {
		const { t } = useTranslation('specialists')
		const formTitle = title || t('editSpecialist.title')
		const { updateSpecialist, deleteSpecialist } = useSpecialist()
		const { resetPassword } = useAuthUser()
		const { orgId } = useCurrentUser()
		const [passwordResetMessage, setPasswordResetMessage] = useState<MessageResponse | null>(null)
		const [saveMessage, setSaveMessage] = useState<string | null>(null)
		const [showModal, setShowModal] = useState(false)

		const EditSpecialistValidationSchema = yup.object().shape({
			firstName: yup
				.string()
				.min(2, t('editSpecialist.yup.tooShort'))
				.max(25, t('editSpecialist.yup.tooLong'))
				.required(t('editSpecialist.yup.required')),
			lastName: yup
				.string()
				.min(2, t('editSpecialist.yup.tooShort'))
				.max(25, t('editSpecialist.yup.tooLong'))
				.required(t('editSpecialist.yup.required')),
			userName: yup
				.string()
				.min(2, t('editSpecialist.yup.tooShort'))
				.max(20, t('editSpecialist.yup.tooLong'))
				.required(t('editSpecialist.yup.required')),
			email: yup
				.string()
				.email(t('editSpecialist.yup.invalidEmail'))
				.required(t('editSpecialist.yup.required')),
			phone: yup.string()
		})

		const handleEditSpecialist = async (values) => {
			let currentRoles: RoleTypeInput[] = specialist.roles.map((role) => {
				return {
					orgId: role.orgId,
					roleType: role.roleType
				}
			})

			if (values.admin) {
				if (!currentRoles.some((r) => r.roleType === RoleType.Admin)) {
					currentRoles.push({ orgId: orgId, roleType: RoleType.Admin })
				}
			} else {
				currentRoles = currentRoles.filter((role) => role.roleType !== RoleType.Admin)
			}

			const editUser: UserInput = {
				id: specialist.id,
				first: values.firstName,
				last: values.lastName,
				userName: values.userName,
				email: values.email,
				phone: values.phone,
				roles: currentRoles
			}

			const response = await updateSpecialist(editUser)

			if (response.status === StatusType.Success) {
				setSaveMessage(null)
				closeForm()
			} else {
				setSaveMessage(response.message)
			}

			closeForm()
		}

		const handleDeleteSpecialist = async (sid: string) => {
			await deleteSpecialist(sid)
			setShowModal(false)
			closeForm()
		}

		const sendPasswordReset = async (sid: string) => {
			const response = await resetPassword(sid)
			setPasswordResetMessage(response)
		}

		return (
			<div className={cx(className)}>
				<Formik
					validateOnBlur
					initialValues={{
						firstName: specialist.name.first,
						lastName: specialist.name.last,
						userName: specialist.userName,
						email: specialist.email,
						phone: specialist.phone || '',
						admin: specialist.roles.some((r) => r.roleType === RoleType.Admin)
					}}
					validationSchema={EditSpecialistValidationSchema}
					onSubmit={(values) => {
						handleEditSpecialist(values)
					}}
				>
					{({ errors }) => {
						return (
							<>
								<Form>
									<FormTitle>{formTitle}</FormTitle>
									<FormSectionTitle className='mt-5'>
										{t('editSpecialist.fields.specialistInfo')}
									</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='firstName'
												placeholder={t('editSpecialist.fields.firstNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.firstName}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormikField
												name='lastName'
												placeholder={t('editSpecialist.fields.lastNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.lastName}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>
									<FormSectionTitle>{t('editSpecialist.fields.userNameInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='userName'
												placeholder={t('editSpecialist.fields.userNamePlaceholder')}
												className={cx(styles.field)}
												error={errors.userName}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>
									<FormSectionTitle>{t('editSpecialist.fields.adminRoleInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col className={cx(styles.checkBox)}>
											<FormikField name='admin' type='checkbox' className={cx(styles.field)} />
											<span>{t('editSpecialist.fields.adminRolePlaceholder')}</span>
										</Col>
									</Row>
									<FormSectionTitle>{t('editSpecialist.fields.addContactInfo')}</FormSectionTitle>
									<Row className='mb-4 pb-2'>
										<Col>
											<FormikField
												name='email'
												placeholder={t('editSpecialist.fields.emailPlaceholder')}
												className={cx(styles.field)}
												error={errors.email}
												errorClassName={cx(styles.errorLabel)}
											/>
											<FormikField
												name='phone'
												placeholder={t('editSpecialist.fields.phonePlaceholder')}
												className={cx(styles.field)}
												error={errors.phone as string}
												errorClassName={cx(styles.errorLabel)}
											/>
										</Col>
									</Row>

									<FormikSubmitButton className={cx(styles.submitButton)}>
										{t('editSpecialist.buttons.save')}
									</FormikSubmitButton>

									<FormikButton
										type='button'
										className={cx(styles.passwordResetButton)}
										onClick={() => sendPasswordReset(specialist.id)}
									>
										{t('editSpecialist.buttons.passwordReset')}
									</FormikButton>
									{saveMessage && (
										<div className={cx('mt-5 alert alert-danger')}>
											{t('editSpecialist.submitMessage.failed')}
										</div>
									)}
									{passwordResetMessage &&
										(passwordResetMessage.status === StatusType.Success ? (
											<div className={cx('mt-5 alert alert-success')}>
												{t('editSpecialist.passwordResetMessage.success')}
											</div>
										) : (
											<div className={cx('mt-5 alert alert-danger')}>
												{t('editSpecialist.passwordResetMessage.failed')}
											</div>
										))}

									{/* Delete user */}
									<div className='mt-5'>
										<DeleteSpecialistModal
											showModal={showModal}
											user={specialist}
											onSubmit={() => handleDeleteSpecialist(specialist.id)}
											onDismiss={() => setShowModal(false)}
										/>
										<h3 className='mb-3'>{t('editSpecialist.buttons.dangerWarning')}</h3>
										<FormikButton
											type='button'
											className={cx(styles.deleteButton, 'btn btn-danger')}
											onClick={() => setShowModal(true)}
										>
											{t('editSpecialist.buttons.delete')}
										</FormikButton>
										<div className='mt-3 alert alert-danger'>
											{t('editSpecialist.buttons.deleteWarning')}
										</div>
									</div>
								</Form>
							</>
						)
					}}
				</Formik>
			</div>
		)
	}
)
