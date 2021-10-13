/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Tag, TagCategory } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { UserCardRow } from '~ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'

export const MobileCard: FC<{
	tag: Tag
	actions: IMultiActionButtons<Tag>[]
	onClick: () => void
}> = memo(function MobileCard({ tag, actions, onClick }) {
	const totalUses =
		((tag?.usageCount?.services || 0) + (tag?.usageCount?.engagements || 0)) |
		((tag?.usageCount.clients || 0) + (tag?.usageCount.serviceAnswers || 0))
	const { t, c } = useTranslation('tags')
	return (
		<UserCardRow
			title={tag.label}
			titleLink='/'
			body={
				<Col className='ps-1 pt-2'>
					<Row className='ps-2 pb-2'>
						<Col className='g-0'>
							<strong>{c(`tagCategory.${tag.category ?? TagCategory.Other}`)}</strong>
						</Col>
					</Row>
					{tag.description && <Row className='ps-2 pb-2'>{tag.description}</Row>}
					<Row className='ps-2 pb-2 pt-2'>{t('requestTag.list.columns.usageCounts')}:</Row>
					<Row className='ps-2'>
						<Col>
							<Row>{t('requestTagListColumns.total')}</Row>
							<Row>{totalUses}</Row>
						</Col>
						<Col>
							<Row>{t('requestTagListColumns.services')}</Row>
							<Row>{tag?.usageCount?.services || 0}</Row>
						</Col>
						<Col>
							<Row>{t('requestTagListColumns.serviceAnswers')}</Row>
							<Row>{tag?.usageCount?.serviceAnswers || 0}</Row>
						</Col>
						<Col>
							<Row>{t('requestTagListColumns.engagements')}</Row>
							<Row>{tag?.usageCount?.engagements || 0}</Row>
						</Col>
						<Col>
							<Row>{t('requestTagListColumns.clients')}</Row>
							<Row>{tag?.usageCount?.clients || 0}</Row>
						</Col>
						<Col className={cx('d-flex justify-content-end')}>
							<MultiActionButton columnItem={tag} buttonGroup={actions} />
						</Col>
					</Row>
				</Col>
			}
			onClick={onClick}
		/>
	)
})
