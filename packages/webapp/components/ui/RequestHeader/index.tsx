/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import type ComponentProps from '~types/ComponentProps'
import RequestType from '~types/Request'
import ContactInfo from '~ui/ContactInfo'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	request?: RequestType | Record<string, any>
}

export default function RequestHeader({ request }: RequestHeaderProps): JSX.Element {
	if (!request?.requester) {
		return null
	}

	const { requester } = request
	const { fullName, age, contact } = requester

	return (
		<div className='py-5 my-5'>
			<h3>{fullName}</h3>
			<h4>Age: {age}</h4>

			<Row className='no-gutters'>
				<Col>
					<>
						<h5>Contact</h5>
						<ContactInfo contact={contact} />
					</>
				</Col>
				<Col>
					<>
						<h5>Identifiers</h5>
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
}
