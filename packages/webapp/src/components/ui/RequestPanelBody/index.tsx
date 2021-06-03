/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
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
import { useAuthUser } from '~hooks/api/useAuth'
import { useEngagement } from '~hooks/api/useEngagement'
import { Formik, Form } from 'formik'

interface RequestPanelBodyProps extends ComponentProps {
	request?: Engagement
}

export default function RequestPanelBody({ request }: RequestPanelBodyProps): JSX.Element {
	// const timeRemaining = request.endDate - today
	const { id, orgId } = request
	const { authUser, currentUserId } = useAuthUser()
	const { data: engagement, assign, setStatus, addAction } = useEngagement(id, orgId)

	// TODO: Add loading state
	if (!engagement) return null

	const { startDate, description, actions, user } = engagement
	const showClaimRequest = !user ?? false
	const showAssignRequest = authUser.user.roles.some(role => role.roleType === 'ADMIN')
	const showCompleteRequest = (!!user && user.id === currentUserId) ?? false
	const handleAddAction = ({
		comment,
		taggedUserId
	}: {
		comment: string
		taggedUserId: string
	}) => {
		addAction({ comment, taggedUserId })
	}

	return (
		<>
			<RequestHeader request={engagement} />
			<div className={cx(styles.body)}>
				{/* TODO: get string from localizations */}
				<h3 className='mb-2 mb-lg-4 '>
					<strong>Current Request</strong>
				</h3>
				<Row className='mb-2 mb-lg-4'>
					<Col>
						<RequestAssignment user={user} />
					</Col>
					<Col>{/* Time remaining: <strong>{request?.timeRemaining}</strong> */}</Col>
					<Col>
						Date create: <strong>{new Date(startDate).toLocaleDateString()}</strong>
					</Col>
				</Row>

				{/* Request description */}
				<div className='mb-4'>
					<ShortString text={description} limit={240} />
				</div>

				{/* Request action button section */}
				{showCompleteRequest && (
					<div className='d-flex mb-5 align-items-center'>
						{/* TODO: get string from localizations */}
						<HappySubmitButton
							className='me-3 p-4'
							text='Request Complete'
							clickFunction={() => setStatus('CLOSED')}
						/>

						{/* TODO: get string from localizations */}
						<DefaultButton
							className='me-3 p-4 border-primary text-primary'
							text='See Client History'
						/>
					</div>
				)}
				{showClaimRequest && (
					<>
						{!showAssignRequest && (
							<div className='mb-5'>
								<PrimaryButton
									className='me-3 p-4'
									text='Claim Request'
									onClick={() => assign(currentUserId)}
								/>
							</div>
						)}

						{showAssignRequest && (
							<Formik
								initialValues={{
									specialist: ''
								}}
								onSubmit={values => {
									assign(values.specialist)
								}}
							>
								<Form>
									<Row className='mb-2 mb-lg-4'>
										<Col>
											<SpecialistSelect name='specialist' placeholder='Assign to specialist...' />
										</Col>
										<Col md='auto'>
											<FormikSubmitButton>Assign</FormikSubmitButton>
										</Col>
									</Row>
								</Form>
							</Formik>
						)}
					</>
				)}

				{/* Create new action form */}
				<RequestActionForm className='mt-2 mt-lg-4 mb-4 mb-lg-5' onSubmit={handleAddAction} />

				{/* Request Timeline */}
				<RequestActionHistory className='mb-5' requestActions={actions} />
			</div>
		</>
	)
}
