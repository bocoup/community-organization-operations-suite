/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import TagList from '~lists/TagList'
import type ComponentProps from '~types/ComponentProps'
import IRequest from '~types/Request'
import ContactInfo from '~ui/ContactInfo'
import cx from 'classnames'
import styles from './index.module.scss'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	request?: IRequest
}

export default function RequestHeader({ request }: RequestHeaderProps): JSX.Element {
	if (!request?.requester) {
		return null
	}

	const { requester, tags } = request
	const { fullName, age, contact } = requester

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>{fullName}</h3>
				<h5>Date of Birth: {age}</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>Contact</h5>
						<ContactInfo contact={contact} />
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>Identifiers</h5>
						<TagList tags={tags} />
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
}
