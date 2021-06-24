/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import TagList from '~lists/TagList'
import type ComponentProps from '~types/ComponentProps'
import ContactInfo from '~ui/ContactInfo'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { memo } from 'react'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	request?: Engagement
}

const RequestHeader = memo(function RequestHeader({ request }: RequestHeaderProps): JSX.Element {
	if (!request?.contact) {
		return null
	}

	const { contact, tags } = request
	const {
		name: { first, last },
		address,
		email,
		phone,
		dateOfBirth
	} = contact

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{first} {last}
				</h3>
				<h5>Date of Birth: {new Intl.DateTimeFormat('en-US').format(new Date(dateOfBirth))}</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>Contact</h5>
						<ContactInfo contact={{ email, phone, address }} />
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>Identifiers</h5>
						<TagList tags={tags} light />
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
})
export default RequestHeader
