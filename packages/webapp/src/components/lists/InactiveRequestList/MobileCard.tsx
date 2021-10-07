/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { Col, Row } from 'react-bootstrap'
import { UsernameTag } from '~ui/UsernameTag'
import { useTranslation } from '~hooks/useTranslation'
import { EngagementMobileCard } from '~components/ui/EngagementMobileCard'

export const MobileCard: FC<{ engagement: Engagement }> = memo(function MobileCard({ engagement }) {
	const { t } = useTranslation('requests')
	return (
		<EngagementMobileCard engagement={engagement}>
			<Row className='ps-2'>
				<Col>
					<Row className='text-gray-5'>{t('requestListColumns.closedDate')}</Row>
					<Row>{new Date(engagement.endDate).toLocaleDateString()}</Row>
				</Col>
				<Col>
					<Row className='text-gray-5'>{t('requestListColumns.lastUpdatedBy')}</Row>
					<Row className='text-primary'>
						{engagement.actions.length > 0 && (
							<UsernameTag
								userId={engagement.actions[0].user.id}
								userName={engagement.actions[0].user.userName}
								identifier='specialist'
							/>
						)}
					</Row>
				</Col>
			</Row>
		</EngagementMobileCard>
	)
})
