/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import TagList from '~lists/TagList'
import type ComponentProps from '~types/ComponentProps'
import Specialist from '~types/Specialist'
import ContactInfo from '~ui/ContactInfo'
import UserAvatar from '~ui/UserAvatar'

interface SpecialistHeaderProps extends ComponentProps {
	title?: string
	specialist: Specialist
}

export default function RequestHeader({ specialist }: SpecialistHeaderProps): JSX.Element {
	if (!specialist) {
		return null
	}

	const { fullName, contact, tags, avatar, userName } = specialist

	return (
		<div className='py-5 my-5'>
			<div className='mb-5'>
				<h3>{fullName}</h3>
				<h5>@{userName}</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				{avatar && (
					<Col className='mb-3 mb-md-0'>
						<UserAvatar avatar={avatar} />
					</Col>
				)}

				<Col className='mb-3 mb-md-0'>
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
