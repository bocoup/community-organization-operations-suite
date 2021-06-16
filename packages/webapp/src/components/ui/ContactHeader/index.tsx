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
import type { Contact } from '@greenlight/schema/lib/client-types'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	contact?: Contact
}

export default function RequestHeader({ contact }: RequestHeaderProps): JSX.Element {
	if (!contact) {
		return null
	}

	const {
		name: { first, middle, last },
		address,
		email,
		phone,
		dateOfBirth
	} = contact

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{first} {middle} {last}
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
				<Col>{/* <>
						<h5 className='mb-2'>Attributes</h5>
						<TagList tags={tags} light />
					</> */}</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
}
