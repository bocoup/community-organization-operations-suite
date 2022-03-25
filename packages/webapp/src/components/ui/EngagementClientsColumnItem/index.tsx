/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import type { FC } from 'react'
import { Fragment, memo } from 'react'
import { EngagementContact } from '~ui/EngagementContact'

export const EngagementClientsColumnItem: FC<{ engagement: Engagement }> = memo(
	function ClientsColumnItem({ engagement }) {
		return (
			<div className='d-flex'>
				{engagement.contacts.map((contact, index) => (
					<Fragment key={index}>
						<EngagementContact contact={contact} key={contact.id} />
						{index < engagement.contacts.length - 1 && <span>&#44;&nbsp;</span>}
					</Fragment>
				))}
			</div>
		)
	}
)
