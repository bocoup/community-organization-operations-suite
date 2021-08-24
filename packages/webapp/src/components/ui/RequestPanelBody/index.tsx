/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { PrimaryButton, DefaultButton } from '@fluentui/react'
import ShortString from '~ui/ShortString'
import HappySubmitButton from '~ui/HappySubmitButton'
import SpecialistSelect from '~ui/SpecialistSelect'
import FormikSubmitButton from '~components/ui/FormikSubmitButton'
import RequestActionHistory from '~lists/RequestActionHistory'
import RequestActionForm from '~forms/RequestActionForm'
import RequestAssignment from '~ui/RequestAssignment'
import { useEngagement } from '~hooks/api/useEngagement'
import { Formik, Form } from 'formik'
import { memo, useEffect } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { getTimeDuration } from '~utils/getTimeDuration'
import { useRouter } from 'next/router'
import ContactInfo from '../ContactInfo'

interface RequestPanelBodyProps extends ComponentProps {
	request?: { id: string; orgId: string }
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

const RequestPanelBody = memo(function RequestPanelBody({
	request,
	onClose,
	isLoaded
}: RequestPanelBodyProps): JSX.Element {
	const { t, c } = useTranslation('requests')
	const router = useRouter()
	const { id, orgId } = request
	const { currentUser, userId } = useCurrentUser()
	const {
		data: engagement,
		assign,
		addAction,
		completeEngagement,
		setStatus,
		loading,
		loadEngagement
	} = useEngagement(id, orgId)

	useEffect(() => {
		isLoaded?.(!loading)
	}, [loading, isLoaded])

	// TODO: Add loading state
	if (!engagement) return null

	const { startDate, endDate, description, actions, user, status, title } = engagement
	const showClaimRequest = !user ?? false
	const showAssignRequest = currentUser.roles.some(role => role.roleType === 'ADMIN')
	const showCompleteRequest = (!!user && user.id === userId) ?? false
	const isNotInactive = status !== 'CLOSED' && status !== 'COMPLETED'
	const handleAddAction = ({
		comment,
		taggedUserId,
		tags
	}: {
		comment: string
		taggedUserId: string
		tags: string[]
	}) => {
		addAction({ comment, taggedUserId, tags })
		loadEngagement(request.id)
	}

	const handleCompleteRequest = async () => {
		await completeEngagement()
		setTimeout(() => onClose?.(), 500)
	}

	const handleCloseRequest = async () => {
		await setStatus('CLOSED')
		setTimeout(() => onClose?.(), 500)
	}

	const timeRemaining = () => {
		const { duration, unit } = getTimeDuration(new Date().toISOString(), endDate)
		if (unit === 'Overdue') {
			return c(`utils.getTimeDuration.${unit.toLowerCase()}`)
		}

		const translatedUnit = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
		return `${duration} ${translatedUnit}`
	}

	return (
		<div className={styles.bodyWrapper}>
			<div className={cx(styles.body)}>
				<h3 className='mb-2 mb-lg-4 '>
					<strong>{title}</strong>
				</h3>
				<Row className='mb-2 mb-lg-4'>
					<Col>
						<RequestAssignment user={user} />
					</Col>
					<Col>
						{t('viewRequest.body.timeRemaining')}: <strong>{timeRemaining()}</strong>
					</Col>
					<Col>
						{t('viewRequest.body.dateCreated')}:{' '}
						<strong>{new Date(startDate).toLocaleDateString()}</strong>
					</Col>
				</Row>

				{/* Request description */}
				<div className='mb-4'>
					<ShortString text={description} limit={240} />
				</div>

				{/* Request action button section */}
				{showCompleteRequest && isNotInactive && (
					<div className='d-flex mb-5 align-items-center justify-content-between'>
						{/* TODO: get string from localizations */}
						<HappySubmitButton
							className='me-3 p-4'
							text={t('viewRequest.body.buttons.complete')}
							clickFunction={handleCompleteRequest}
						/>

						{/* TODO: get string from localizations */}
						<DefaultButton
							onClick={handleCloseRequest}
							className='me-3 p-4 border-danger text-danger'
							text={t('viewRequest.body.buttons.close')}
						/>
					</div>
				)}
				{showClaimRequest && isNotInactive && (
					<>
						{!showAssignRequest && (
							<div className='mb-5'>
								<PrimaryButton
									className='me-3 p-4'
									text={t('viewRequest.body.buttons.claim')}
									onClick={() => assign(userId)}
								/>
							</div>
						)}

						{/* TODO: this should be in it's own form */}
						{showAssignRequest && (
							<Formik
								initialValues={{
									specialist: null
								}}
								onSubmit={values => {
									assign(values.specialist.value)
								}}
							>
								<Form>
									<Row className='mb-2 mb-lg-4'>
										<Col>
											<SpecialistSelect
												name='specialist'
												placeholder={t('viewRequest.body.assignTo.placeholder')}
											/>
										</Col>
										<Col md='auto'>
											<FormikSubmitButton>
												{t('viewRequest.body.buttons.assign')}
											</FormikSubmitButton>
										</Col>
									</Row>
								</Form>
							</Formik>
						)}
					</>
				)}
				<div className={styles.contactsContainer}>
					<span className='d-inline-block mb-4'>
						<strong>Client Information</strong>
					</span>
					<Row>
						{engagement?.contacts.map((contact, index) => (
							<Col key={index} md={6} className='mb-4'>
								<div className='d-block text-primary'>
									<strong>
										{contact.name.first} {contact.name.last}
									</strong>
								</div>
								<div className='d-block mb-2'>
									Birthdate:{' '}
									<strong>
										{new Intl.DateTimeFormat(router.locale).format(new Date(contact.dateOfBirth))}
									</strong>
								</div>
								<div className={styles.contactInfo}>
									<ContactInfo
										contact={{
											email: contact.email,
											phone: contact.phone,
											address: contact.address
										}}
									/>
								</div>
							</Col>
						))}
					</Row>
				</div>
				{/* Create new action form */}
				{isNotInactive && (
					<RequestActionForm className='mt-2 mt-lg-4 mb-4 mb-lg-5' onSubmit={handleAddAction} />
				)}

				{/* Request Timeline */}
				<RequestActionHistory className='mb-5' requestActions={actions} />
			</div>
		</div>
	)
})
export default RequestPanelBody
