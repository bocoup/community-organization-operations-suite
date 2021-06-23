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
import { UserInput, RoleTypeInput } from '@greenlight/schema/lib/client-types'
import { useAuthUser } from '~hooks/api/useAuth'
import { memo, useState } from 'react'

interface AddSpecialistFormProps extends ComponentProps {
	title?: string
	closeForm?: () => void
}

const NewNavigatorValidationSchema = yup.object().shape({
	firstName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	lastName: yup.string().min(2, 'Too short!').max(25, 'Too long!').required('Required'),
	userName: yup.string().min(2, 'Too short').max(20, 'Too long!').required('Required'),
	email: yup.string().email('Invalid email').required('Required'),
	phone: yup.string()
})

const AddSpecialistForm = memo(function AddSpecialistForm({
	title,
	className,
	closeForm
}: AddSpecialistFormProps): JSX.Element {
	const formTitle = title || 'Add Specialist'
	const { createSpecialist } = useSpecialist()
	const { authUser } = useAuthUser()
	const orgId = authUser.user.roles[0].orgId
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

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
								<FormSectionTitle className='mt-5'>Specialist info</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col md={5}>
										<FormikField
											name='firstName'
											placeholder='Firstname'
											className={cx(styles.field)}
											error={errors.firstName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col md={2}>
										<FormikField
											name='middleInitial'
											placeholder='MI'
											className={cx(styles.field)}
											error={errors.middleInitial}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
									<Col md={5}>
										<FormikField
											name='lastName'
											placeholder='Lastname'
											className={cx(styles.field)}
											error={errors.lastName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<FormSectionTitle>Username</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='userName'
											placeholder='Username'
											className={cx(styles.field)}
											error={errors.userName}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>
								<FormSectionTitle>Admin Role</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col className={cx(styles.checkBox)}>
										<FormikField name='admin' type='checkbox' className={cx(styles.field)} />
										<span>Does this specialist require elevated privileges?</span>
									</Col>
								</Row>
								<FormSectionTitle>Add Contact info</FormSectionTitle>
								<Row className='mb-4 pb-2'>
									<Col>
										<FormikField
											name='email'
											placeholder='Email address'
											className={cx(styles.field)}
											error={errors.email}
											errorClassName={cx(styles.errorLabel)}
										/>
										<FormikField
											name='phone'
											placeholder='Phone #'
											className={cx(styles.field)}
											error={errors.phone as string}
											errorClassName={cx(styles.errorLabel)}
										/>
									</Col>
								</Row>

								<FormikSubmitButton>Create Specialist</FormikSubmitButton>
								{submitMessage && (
									<div className={cx('mt-5 alert alert-danger')}>
										Submit Failed: {submitMessage}, review and update fields or edit the existing
										account.
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
