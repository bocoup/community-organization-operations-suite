/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { User } from '@greenlight/schema/lib/client-types'
import PaginatedList from '~ui/PaginatedList'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import IconButton from '~ui/IconButton'
import MultiActionButton from '~components/ui/MultiActionButton'
import useWindowSize from '~hooks/useWindowSize'
import UserCardRow from '~components/ui/UserCardRow'
import CardRowTitle from '~ui/CardRowTitle'
import SpecialistPanel from '~components/ui/SpecialistPanel'
import SpecialistHeader from '~ui/SpecialistHeader'
import { useCallback, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import ShortString from '~components/ui/ShortString'

interface SpecialistListProps extends ComponentProps {
	title?: string
	list?: User[]
}

export default function SpecialistList({ list, title }: SpecialistListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openSpecialistPanel, setFalse: dismissSpecialistPanel }] = useBoolean(
		false
	)
	const [specialist, setSpecialist] = useState<User | undefined>()

	const openSpecialistDetails = useCallback(
		(sid: string) => {
			const selectedSpecialist = list.find((s: User) => s.id === sid)
			setSpecialist(selectedSpecialist)
			openSpecialistPanel()
		},
		[openSpecialistPanel, list]
	)

	if (!list || list.length === 0) return null

	return (
		<div className={cx('mt-5 mb-5', styles.specialistList)}>
			<div className='d-flex justify-content-between mb-3'>
				{!!title && (
					<h2 className={cx('d-flex align-items-center', styles.detailsListTitle)}>{title}</h2>
				)}
				<IconButton icon='CircleAdditionSolid' text={'Add Specialist'} />
			</div>
			{isMD ? (
				<Col>
					<Row className={cx(styles.columnHeaderRow)}>
						<Col className={cx(styles.columnItem)}>Name</Col>
						<Col className={cx(styles.columnItem)}># of Engagements</Col>
						<Col className={cx(styles.columnItem)}>Username</Col>
						<Col className={cx(styles.columnItem)}>Permissions</Col>
						<Col className={cx('w-100 d-flex justify-content-end', styles.columnItem)}></Col>
					</Row>
					<PaginatedList
						list={list}
						itemsPerPage={20}
						renderListItem={(user: User, key: number) => {
							return (
								<Row key={key} className={cx('align-items-center', styles.rowItem)}>
									<Col className={cx(styles.columnItem)}>
										<CardRowTitle
											tag='span'
											title={`${user.name.first} ${user.name.last}`}
											titleLink='/'
											onClick={() => openSpecialistDetails(user.id)}
										/>
									</Col>
									<Col className={cx(styles.columnItem)}>0</Col>
									<Col className={cx(styles.columnItem)}>@{user.userName}</Col>
									<Col className={cx(styles.columnItem)}>
										{user.roles.map(r => r.roleType).join(', ')}
									</Col>
									<Col className={cx(styles.columnItem, 'w-100 d-flex justify-content-end')}>
										<MultiActionButton />
									</Col>
								</Row>
							)
						}}
					/>
				</Col>
			) : (
				<PaginatedList
					list={list}
					itemsPerPage={10}
					renderListItem={(user: User, key: number) => {
						return (
							<UserCardRow
								key={key}
								title={`${user.name.first} ${user.name.last}`}
								titleLink='/'
								body={
									<Col>
										<Row className='ps-2'>@{user.userName}</Row>
										<Row className='ps-2 pb-4'>{user.roles.map(r => r.roleType).join(', ')}</Row>
										<Row className='ps-2'>
											<Col>
												<Row># of Engagements</Row>
												<Row>0</Row>
											</Col>
											<Col className={cx('d-flex justify-content-end')}>
												<MultiActionButton />
											</Col>
										</Row>
									</Col>
								}
							/>
						)
					}}
				/>
			)}
			<SpecialistPanel openPanel={isOpen} onDismiss={() => dismissSpecialistPanel()}>
				<SpecialistHeader specialist={specialist} />
				<div className={cx(styles.specialistDetailsWrapper)}>
					<div className='mb-3 mb-lg-5'>
						<h3 className='mb-2 mb-lg-4 '>
							<strong>Bio</strong>
						</h3>
						<ShortString text={specialist?.description} limit={240} />
					</div>
					{specialist?.additionalInfo && (
						<div className='mb-3 mb-lg-5'>
							<h3 className='mb-2 mb-lg-4 '>
								<strong>Training / Achievements</strong>
							</h3>
							<ShortString text={specialist.additionalInfo} limit={240} />
						</div>
					)}
				</div>
			</SpecialistPanel>
		</div>
	)
}
