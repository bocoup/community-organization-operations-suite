/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect } from 'react'
import CardRowTitle from '~components/ui/CardRowTitle'
import RequestPanel from '~components/ui/RequestPanel'
import AddRequestForm from '~forms/AddRequestForm'
import EditRequestForm from '~forms/EditRequestForm'
import useWindowSize from '~hooks/useWindowSize'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'
import Panel from '~ui/Panel'
import ShortString from '~ui/ShortString'
import ComponentProps from '~types/ComponentProps'
import type { Engagement, EngagementInput } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import ClientOnly from '~ui/ClientOnly'
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
	const [
		isEditFormOpen,
		{ setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }
	] = useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useEffect(() => {
		if (requests) setFilteredList(requests)
	}, [requests])

	const openRequestDetails = (eid: string) => {
		const nextSelectedEngagement = requests.find(e => e.id === eid)

		setSelectedEngagement(nextSelectedEngagement)
		openRequestPanel()
	}

	const searchList = useCallback(
		(searchStr: string) => {
			// TODO: implement search query
			const filteredEngagementList = requests.filter(
				(e: Engagement) =>
					e.contact.name.first.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.contact.name.last.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.description.toLowerCase().includes(searchStr.toLowerCase())
			)
			setFilteredList(filteredEngagementList)
		},
		[requests]
	)

	const handleAdd = (values: EngagementInput) => {
		dismissNewRequestPanel()
		onAdd?.(values)
	}

	const columnActionButtons: IMultiActionButtons<Engagement>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(engagement: Engagement) {
				setSelectedEngagement(engagement)
				openEditRequestPanel()
			}
		}
	]

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
				return getTimeDuration(new Date().toISOString(), engagement.endDate)
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
			onRenderColumnItem: function onRenderColumnItem(item: Engagement) {
				return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
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
										<MultiActionButton columnItem={engagement} buttonGroup={columnActionButtons} />
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
		<ClientOnly>
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
						onListAddButtonClick={openNewRequestPanel}
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
						onListAddButtonClick={openNewRequestPanel}
						onPageChange={onPageChange}
						isMD={false}
					/>
				)}
			</div>
			<Panel openPanel={isNewFormOpen} onDismiss={dismissNewRequestPanel}>
				<AddRequestForm onSubmit={handleAdd} showAssignSpecialist />
			</Panel>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm title='Edit Requests' engagement={selectedEngagement} />
			</Panel>
			<RequestPanel
				openPanel={isOpen}
				onDismiss={dismissRequestPanel}
				request={selectedEngagement}
			/>
		</ClientOnly>
	)
}
