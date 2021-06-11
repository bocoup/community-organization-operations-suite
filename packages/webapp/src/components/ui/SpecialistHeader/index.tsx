/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { User } from '@greenlight/schema/lib/client-types'
import ContactInfo from '~ui/ContactInfo'

interface SpecialistHeaderProps extends ComponentProps {
	title?: string
	specialist: User
}

export default function RequestHeader({ specialist }: SpecialistHeaderProps): JSX.Element {
	if (!specialist) {
		return null
	}

	const { name, address, userName, email, phone } = specialist

	const contactInfo = { email, phone, address }

	const permission =
		specialist.roles.filter(r => r.roleType === 'ADMIN').length > 0 ? 'Admin' : 'User'

	return (
		<div className={cx(styles.specialistHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{name.first} {name.last}
				</h3>
				<h5>@{userName}</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>Contact</h5>
						<ContactInfo contact={contactInfo} />
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>Status</h5>
						<div>Active</div>
						<h5 className='mt-4 mb-2'>Permissions</h5>
						<div>{permission}</div>
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
}
