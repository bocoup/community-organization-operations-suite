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

interface SpecialistListProps extends ComponentProps {
	title?: string
	list?: User[]
}

export default function SpecialistList({ list, title }: SpecialistListProps): JSX.Element {
	const { isMD } = useWindowSize()
	if (!list || list.length === 0) return null

	return (
		<div className={cx('mt-5 mb-5')}>
			<div className='d-flex justify-content-between mb-3'>
				{!!title && (
					<h2 className={cx('d-flex align-items-center', styles.detailsListTitle)}>{title}</h2>
				)}
				<IconButton icon='CircleAdditionSolid' text={'Add Specialist'} />
			</div>
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
					renderListItem={(item: User, key: number) => {
						return (
							<Row key={key} className={cx('align-items-center', styles.rowItem)}>
								<Col className={cx(styles.columnItem, 'text-primary')}>
									{item.name.first} {item.name.last}
								</Col>
								<Col className={cx(styles.columnItem)}>0</Col>
								<Col className={cx(styles.columnItem)}>@{item.userName}</Col>
								<Col className={cx(styles.columnItem)}>
									{item.roles.map(r => r.roleType).join(', ')}
								</Col>
								<Col className={cx(styles.columnItem, 'w-100 d-flex justify-content-end')}>
									<MultiActionButton />
								</Col>
							</Row>
						)
					}}
				/>
			</Col>
		</div>
	)
}
