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
import { User } from '@greenlight/schema/lib/client-types'

interface SpecialistHeaderProps extends ComponentProps {
	title?: string
	specialist: User
}

export default function RequestHeader({ specialist }: SpecialistHeaderProps): JSX.Element {
	if (!specialist) {
		return null
	}

	const { name, userName } = specialist

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
						{/* <ContactInfo contact={contact} /> */}
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>Attributes</h5>
						{/* <TagList tags={tags} /> */}
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
}
