/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect } from 'react'
import CardRowTitle from '~components/ui/CardRowTitle'
import RequestPanel from '~components/ui/RequestPanel'
import AddRequestForm from '~forms/AddRequestForm'
import useWindowSize from '~hooks/useWindowSize'
import MultiActionButton from '~ui/MultiActionButton'
import Panel from '~ui/Panel'
import ShortString from '~ui/ShortString'
import ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'

interface RequestListProps extends ComponentProps {
	title: string
	requests?: Engagement[]
	onPageChange?: (items: Engagement[], currentPage: number) => void
	onAdd: (form: any) => void
}

export default function RequestList({
	title,
	requests,
	onAdd,
	onPageChange
}: RequestListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openRequestPanel, setFalse: dismissRequestPanel }] = useBoolean(false)
	const [
		isNewFormOpen,
		{ setTrue: openNewRequestPanel, setFalse: dismissNewRequestPanel }
	] = useBoolean(false)

	const sortedList = Object.values(requests || [])?.sort((a, b) =>
		a.contact.name.first > b.contact.name.first ? 1 : -1
	)

	const [filteredList, setFilteredList] = useState<Engagement[]>(sortedList)
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useEffect(() => {
		const sortedList = Object.values(requests || [])?.sort((a, b) =>
			a.contact.name.first > b.contact.name.first ? 1 : -1
		)
		setFilteredList(sortedList)
	}, [requests])

	const openRequestDetails = useCallback(
		(eid: string) => {
			const selectedEngagement = sortedList.find(e => e.id === eid)
			setSelectedEngagement(selectedEngagement)
			openRequestPanel()
		},
		[openRequestPanel, sortedList]
	)

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(sortedList)
			} else {
				const filteredUsers = sortedList.filter(
					(engagement: Engagement) =>
						engagement.contact.name.first.toLowerCase().includes(searchStr.toLowerCase()) ||
						engagement.contact.name.last.toLowerCase().includes(searchStr.toLowerCase())
				)
				setFilteredList(filteredUsers)
			}
		},
		[sortedList]
	)

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement) {
				const { contact } = engagement
				return (
					<CardRowTitle
						tag='span'
						title={`${contact.name.first} ${contact.name.last}`}
						titleLink='/'
						onClick={() => openRequestDetails(engagement.id)}
					/>
				)
			}
		},
		{
			key: 'request',
			name: 'Request',
			className: 'col-5',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				return <ShortString text={engagement.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'timeDuration',
			name: 'Time Remaining',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				return getTimeDuration(engagement.startDate, engagement.endDate)
			}
		},
		{
			key: 'status',
			name: 'Status',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				if (engagement.user) {
					return (
						<div>
							Assigned: <span className='text-primary'>@{engagement.user.userName}</span>
						</div>
					)
				} else {
					return 'Not Started'
				}
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem() {
				return <MultiActionButton />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				return (
					<UserCardRow
						key={index}
						title={`${engagement.contact.name.first} ${engagement.contact.name.last}`}
						titleLink='/'
						body={
							<Col className='p-1'>
								<Row className='d-block ps-2 pt-2 mb-4'>
									<ShortString text={engagement.description} limit={90} />
								</Row>
								<Row className='ps-2'>
									<Col>
										<Row>Time Remaining</Row>
										<Row>{getTimeDuration(engagement.startDate, engagement.endDate)}</Row>
									</Col>
									<Col>
										<Row>{engagement?.user ? 'Assigned' : 'Status'}</Row>
										<Row className='text-primary'>
											{engagement?.user ? `@${engagement.user.userName}` : 'Not Started'}
										</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton />
									</Col>
								</Row>
							</Col>
						}
						onClick={() => openRequestDetails(engagement.id)}
					/>
				)
			}
		}
	]

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.requestList)}>
				{isMD ? (
					<PaginatedList
						title={title}
						list={filteredList}
						itemsPerPage={10}
						columns={pageColumns}
						rowClassName='align-items-center'
						addButtonName='Add Request'
						onSearchValueChange={value => searchList(value)}
						onListAddButtonClick={() => openNewRequestPanel()}
						onPageChange={onPageChange}
					/>
				) : (
					<PaginatedList
						title={title}
						list={filteredList}
						itemsPerPage={5}
						columns={mobileColumn}
						hideListHeaders={true}
						addButtonName='Add Request'
						onSearchValueChange={value => searchList(value)}
						onListAddButtonClick={() => openNewRequestPanel()}
						onPageChange={onPageChange}
						isMD={false}
					/>
				)}
			</div>
			<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewRequestPanel()}>
				<AddRequestForm onSubmit={onAdd} />
			</Panel>
			<RequestPanel
				openPanel={isOpen}
				onDismiss={() => dismissRequestPanel()}
				request={engagement}
			/>
		</>
	)
}
