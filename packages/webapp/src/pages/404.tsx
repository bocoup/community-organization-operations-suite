/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import { memo } from 'react'

const NotFound = memo(function NotFound() {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name}>
			<Col className='mt-5 mb-5'>
				<Row className='align-items-center mb-3'>
					<Col>
						<h2 className='d-flex align-items-center'>Page Not Found</h2>
						<div className='mt-5 mb-3'>
							The page you are trying to access is not found or available.
						</div>
						<div>
							Please click{' '}
							<Link href='/'>
								<a>here</a>
							</Link>{' '}
							to go back to the main page.
						</div>
					</Col>
				</Row>
			</Col>
		</ContainerLayout>
	)
})
export default NotFound
