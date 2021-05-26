/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import cx from 'classnames'
import { Col, Row } from 'react-bootstrap'
import { DefaultButton } from '@fluentui/react'
import RequestHeader from '~ui/RequestHeader'
import ShortString from '~ui/ShortString'
import HappySubmitButton from '~ui/HappySubmitButton'
import RequestActionHistory from '~lists/RequestActionHistory'
import RequestActionForm from '~forms/RequestActionForm'

interface RequestPanelBodyProps extends ComponentProps {
	request?: Engagement
}

export default function RequestPanelBody({ request }: RequestPanelBodyProps): JSX.Element {
	// const timeRemaining = request.endDate - today
	const { startDate, description, actions } = request

	return (
		<>
			<RequestHeader request={request} />
			<div className={cx(styles.body)}>
				{/* TODO: get string from localizations */}
				<h3 className='mb-2 mb-lg-4 '>
					<strong>Current Request</strong>
				</h3>
				<Row className='mb-2 mb-lg-4'>
					<Col>
						Assigned to: <strong className='text-primary'>@RickAstley</strong>
					</Col>
					<Col>{/* Time remaining: <strong>{request?.timeRemaining}</strong> */}</Col>
					<Col>
						Date create: <strong>{new Date(startDate).toLocaleDateString()}</strong>
					</Col>
				</Row>

				{/* Request description */}
				<ShortString text={description} limit={240} />

				{/* Create new action form */}
				<RequestActionForm className='mt-2 mt-lg-4 mb-4 mb-lg-5' />

				{/* Request Timeline */}
				<RequestActionHistory className='mb-5' requestActions={actions} />

				{/* <RequestComplete request={request} /> */}
				<div className='d-flex mb-5 pb-5 align-items-center'>
					{/* TODO: get string from localizations */}
					<HappySubmitButton className='me-3 p-4' text='Request Complete' />

					{/* TODO: get string from localizations */}
					<DefaultButton
						className='me-3 p-4 border-primary text-primary'
						text='See Client History'
					/>
				</div>
			</div>
		</>
	)
}
