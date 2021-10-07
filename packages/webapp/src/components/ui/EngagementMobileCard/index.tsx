/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, Fragment, memo } from 'react'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { UserCardRow } from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import { useNavCallback } from '~hooks/useNavCallback'
import { EngagementContact } from '~ui/EngagementContact'

export const EngagementMobileCard: FC<{ engagement: Engagement }> = memo(
	function EngagementMobileCard({ engagement, children }) {
		const handleOpenEngagement = useNavCallback(null, { engagement: engagement.id })
		return (
			<UserCardRow
				title={engagement.title}
				titleLink='/'
				body={
					<Col className='p-1'>
						<Row className='d-block ps-2 pt-2 mb-4'>
							<div className='d-flex g-0'>
								{engagement.contacts.map((contact, index) => (
									<Fragment key={contact.id}>
										<EngagementContact contact={contact} />
										{index < engagement.contacts.length - 1 && <span>&#44;&nbsp;</span>}
									</Fragment>
								))}
							</div>
						</Row>
						{children}
					</Col>
				}
				onClick={handleOpenEngagement}
			/>
		)
	}
)
