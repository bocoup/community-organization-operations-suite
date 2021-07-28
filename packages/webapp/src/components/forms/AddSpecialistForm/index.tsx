/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Formik, Form } from 'formik'
import { Col, Row } from 'react-bootstrap'
import * as yup from 'yup'
import styles from './index.module.scss'
import FormSectionTitle from '~components/ui/FormSectionTitle'
import FormTitle from '~components/ui/FormTitle'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import type ComponentProps from '~types/ComponentProps'
import FormikField from '~ui/FormikField'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { UserInput, RoleTypeInput } from '@resolve/schema/lib/client-types'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

interface AddSpecialistFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const AddSpecialistForm = memo(function AddSpecialistForm({
	title,
	className,
	closeForm
}: AddSpecialistFormProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const formTitle = title || t('addSpecialist.title')
	const { createSpecialist } = useSpecialist()
	const { orgId } = useCurrentUser()
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

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
			.required(t('addSpecialist.yup.required')),
		phone: yup.string()
	})

	const handleCreateSpecialist = async values => {
		const defaultRoles: RoleTypeInput[] = [
			{
				orgId: orgId,
				roleType: 'USER'
			}
		]

		if (values.admin) {
			defaultRoles.push({ orgId: orgId, roleType: 'ADMIN' })
		}

		const newUser: UserInput = {
			first: values.firstName,
			middle: values.middleInital,
			last: values.lastName,
			userName: values.userName,
			email: values.email,
			phone: values.phone,
			roles: defaultRoles
		}

		const response = await createSpecialist(newUser)

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
					firstName: '',
					middleInitial: '',
					lastName: '',
					userName: '',
					email: '',
					phone: '',
					admin: false
				}}
				validationSchema={NewNavigatorValidationSchema}
				onSubmit={values => {
					handleCreateSpecialist(values)
				}}
			>
				{({ values, errors }) => {
					return (
						<>
							<Form>
								<FormTitle>
									{!values.firstName || !values.lastName
										? formTitle
										: `${values.firstName} ${values.middleInitial ?? ''} ${values.lastName}`}
								</FormTitle>
								<FormSectionTitle className='mt-5'>
									{t('addSpecialist.fields.specialistInfo')}
								</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col md={5}>
										<FormikField
											name='firstName'
											placeholder={t('addSpecialist.fields.firstName.placeholder')}
											className={cx(styles.field)}
											error={errors.firstName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col md={2}>
										<FormikField
											name='middleInitial'
											placeholder={t('addSpecialist.fields.middle.placeholder')}
											className={cx(styles.field)}
											error={errors.middleInitial}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col md={5}>
										<FormikField
											name='lastName'
											placeholder={t('addSpecialist.fields.lastName.placeholder')}
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
											placeholder={t('addSpecialist.fields.userName.placeholder')}
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
										<span>{t('addSpecialist.fields.adminRole.placeholder')}</span>
									</Col>
								</Row>
								<FormSectionTitle>{t('addSpecialist.fields.addContactInfo')}</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='email'
											placeholder={t('addSpecialist.fields.email.placeholder')}
											className={cx(styles.field)}
											error={errors.email}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='phone'
											placeholder={t('addSpecialist.fields.phone.placeholder')}
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
})

export default AddSpecialistForm
