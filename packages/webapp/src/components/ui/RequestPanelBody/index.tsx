/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { PrimaryButton, DefaultButton } from '@fluentui/react'
import RequestHeader from '~ui/RequestHeader'
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
	const { t } = useTranslation('requests')
	// const timeRemaining = request.endDate - today
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

	const { startDate, description, actions, user, status } = engagement
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

	return (
		<div className={styles.bodyWrapper}>
			<RequestHeader request={engagement} />
			<div className={cx(styles.body)}>
				{/* TODO: get string from localizations */}
				<h3 className='mb-2 mb-lg-4 '>
					<strong>
						{isNotInactive ? t('viewRequest.body.title') : t('viewRequest.body.closedTitle')}
					</strong>
				</h3>
				<Row className='mb-2 mb-lg-4'>
					<Col>
						<RequestAssignment user={user} />
					</Col>
					<Col>{/* Time remaining: <strong>{request?.timeRemaining}</strong> */}</Col>
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
									specialist: {
										label: '',
										value: ''
									}
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
