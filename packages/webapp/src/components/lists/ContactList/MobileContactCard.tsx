/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { IMultiActionButtons, MultiActionButton } from '~components/ui/MultiActionButton2'
import { Col, Row } from 'react-bootstrap'
import { TagBadge } from '~components/ui/TagBadge'
import { UserCardRow } from '~components/ui/UserCardRow'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useNavCallback } from '~hooks/useNavCallback'
import { GenderText } from './GenderText'
import { RaceText } from './RaceText'
import { EngagementStatusText } from './EngagementStatusText'

export const MobileContactCard: FC<{
	contact: Contact
	actionButtons: Array<IMultiActionButtons<Contact>>
}> = memo(function MobileContactCard({ contact, actionButtons }) {
	const { t } = useTranslation(Namespace.Clients)
	const handleClick = useNavCallback(null, { contact: contact.id })

	return (
		<UserCardRow
			title={`${contact.name.first} ${contact.name.last}${
				contact.status === ContactStatus.Archived ? ' (' + t('archived') + ')' : ''
			}`}
			titleLink='/'
			body={
				<Col>
					<Row className='ps-2'>
						<Col>
							<Row>
								<Col className='g-0'>
									<h4>{t('clientList.columns.requests')}</h4>
								</Col>
							</Row>
							<Row>
								<EngagementStatusText engagements={contact.engagements} />
							</Row>
						</Col>
						<Col className={cx('d-flex justify-content-end')}>
							<MultiActionButton columnItem={contact} buttonGroup={actionButtons} />
						</Col>
					</Row>
					<Row className='ps-2 pt-3'>
						<Col>
							<Row>
								<Col className='g-0'>
									<h4>{t('demographics.gender.label')}</h4>
								</Col>
							</Row>
							<Row>
								<Col className='g-0'>
									<GenderText gender={contact?.demographics?.gender} />
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col className='g-0'>
									<h4>{t('demographics.race.label')}</h4>
								</Col>
							</Row>
							<Row>
								<Col className='g-0'>
									<RaceText race={contact?.demographics?.race} />
								</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<Col className='pt-3'>
							{contact.tags.map((tag, idx) => {
								return (
									<TagBadge key={idx} tag={{ id: tag.id, orgId: tag.orgId, label: tag.label }} />
								)
							})}
						</Col>
					</Row>
				</Col>
			}
			onClick={handleClick}
		/>
	)
})
