/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { getTimeDuration } from '~utils/getTimeDuration'
import { Col, Row } from 'react-bootstrap'
import { UsernameTag } from '~ui/UsernameTag'
import { FC, memo } from 'react'
import { EngagementMobileCard } from '~components/ui/EngagementMobileCard'
import { Namespace, useTranslation } from '~hooks/useTranslation'

export const MobileCard: FC<{
	engagement: Engagement
	actions: Array<IMultiActionButtons<Engagement>>
}> = memo(function MobileCard({ engagement, actions }) {
	const { t, c } = useTranslation(Namespace.Requests)
	const { duration, unit } = getTimeDuration(new Date().toISOString(), engagement.endDate)
	let timeRemaining = ''
	if (unit === 'Overdue') {
		timeRemaining = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
	} else {
		const translatedUnit = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
		timeRemaining = `${duration} ${translatedUnit}`
	}

	return (
		<EngagementMobileCard engagement={engagement}>
			<Row className='ps-2'>
				<Col>
					<Row className='text-gray-5'>{t('requestListColumns.timeRemaining')}</Row>
					<Row>{timeRemaining}</Row>
				</Col>
				<Col>
					<Row className='text-gray-5'>
						{engagement?.user ? t('requestStatus.assigned') : t('requestListColumns.status')}
					</Row>
					<Row className='text-primary'>
						{engagement?.user ? (
							<UsernameTag
								userId={engagement.user.id}
								userName={engagement.user.userName}
								identifier='specialist'
							/>
						) : (
							t('requestStatus.notStarted')
						)}
					</Row>
				</Col>
				<Col className={cx('d-flex justify-content-end flex-column align-items-end')}>
					<MultiActionButton columnItem={engagement} buttonGroup={actions} />
				</Col>
			</Row>
		</EngagementMobileCard>
	)
})
