/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { ContactHeader } from '~components/ui/ContactHeader'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'
import { useContacts } from '~hooks/api/useContacts'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { getTimeDuration } from '~utils/getTimeDuration'
import { UsernameTag } from '~ui/UsernameTag'

interface ContactPanelBodyProps {
	contactId: string
}

export const ContactPanelBody: StandardFC<ContactPanelBodyProps> = memo(function ContactPanelBody({
	contactId
}) {
	const { t, c } = useTranslation('clients')
	const { contacts } = useContacts()
	const [selectedContact] = useState(contacts.find((c) => c.id === contactId))

	const getDurationText = (endDate: string): string => {
		const { duration, unit } = getTimeDuration(new Date().toISOString(), endDate)
		if (unit === 'Overdue') {
			return c(`utils.getTimeDuration.${unit.toLowerCase()}`)
		}

		const translatedUnit = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
		return `${duration} ${translatedUnit}`
	}

	return (
		<>
			<ContactHeader contact={selectedContact} />
			<div className={cx(styles.contactDetailsWrapper)}>
				<div className='mb-3 mb-lg-5'>
					<h3 className='mb-2 mb-lg-4 '>
						<strong>{t('viewClient.body.requestCreated')}</strong>
					</h3>
					{selectedContact?.engagements?.length > 0 ? (
						selectedContact?.engagements.map((e: Engagement, idx: number) => {
							return (
								<Col key={idx} className={cx(styles.requestsCreatedBox)}>
									<Row className='mb-4'>
										<Col>
											<strong>{t('viewClient.body.status')}:</strong>{' '}
											{e.user ? t('viewClient.status.assigned') : t('viewClient.status.notStarted')}
										</Col>
										{e.user ? (
											<Col>
												<strong>{t('viewClient.body.assignedTo')}: </strong>
												<UsernameTag
													userId={e.user.id}
													userName={e.user.userName}
													identifier='specialist'
												/>
											</Col>
										) : (
											<Col></Col>
										)}
									</Row>
									<Row className='mb-4'>
										<Col>{e.description}</Col>
									</Row>
									<Row>
										<Col>
											<strong>{t('viewClient.body.timeRemaining')}: </strong>
											{getDurationText(e.endDate)}
										</Col>
									</Row>
								</Col>
							)
						})
					) : (
						<div>{t('viewClient.body.noRequests')}</div>
					)}
				</div>
			</div>
		</>
	)
})
