/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { RoleType, User } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useNavCallback } from '~hooks/useNavCallback'
import { useTranslation } from '~hooks/useTranslation'
import { UserCardRow } from '~ui/UserCardRow'
import { IMultiActionButtons, MultiActionButton } from '../MultiActionButton2'

export const SpecialistMobileCard: FC<{ user: User; actions: IMultiActionButtons<User>[] }> = memo(
	function SpecialistMobileCard({ user, actions }) {
		const handleClick = useNavCallback(null, { specialist: user.id })
		const { t } = useTranslation('specialists')
		return (
			<UserCardRow
				title={`${user.name.first} ${user.name.last}`}
				titleLink='/'
				body={
					<Col>
						<Row className='ps-2'>@{user.userName}</Row>
						<Row className='ps-2 pb-4'>
							{user?.roles.filter((r) => r.roleType === RoleType.Admin).length > 0
								? t('specialistRoles.admin')
								: t('specialistRoles.user')}
						</Row>
						<Row className='ps-2'>
							<Col>
								<Row>{t('specialistNumOfAssignedEngagement')}</Row>
								<Row>{user?.engagementCounts?.active || 0}</Row>
							</Col>
							<Col className={cx('d-flex justify-content-end')}>
								<MultiActionButton columnItem={user} buttonGroup={actions} />
							</Col>
						</Row>
					</Col>
				}
				onClick={handleClick}
			/>
		)
	}
)
