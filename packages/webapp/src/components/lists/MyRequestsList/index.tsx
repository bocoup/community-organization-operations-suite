/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState } from 'react'
import CardRowTitle from '~components/ui/CardRowTitle'
import RequestPanel from '~components/ui/RequestPanel'
import AddRequestForm from '~forms/AddRequestForm'
import useWindowSize from '~hooks/useWindowSize'
import CardRow from '~ui/CardRow'
import MultiActionButton from '~ui/MultiActionButton'
import Panel from '~ui/Panel'
import ShortString from '~ui/ShortString'
import ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'

interface MyRequestListProps extends ComponentProps {
	title: string
	requests: Engagement[]
}

export default function MyRequests({ title, requests }: MyRequestListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openRequestPanel, setFalse: dismissRequestPanel }] = useBoolean(false)
	const [
		isNewFormOpen,
		{ setTrue: openNewRequestPanel, setFalse: dismissNewRequestPanel }
	] = useBoolean(false)

	const sortedList = Object.values(requests)?.sort((a, b) =>
		a.contact.name.first > b.contact.name.first ? 1 : -1
	)

	const [filteredList, setFilteredList] = useState<Engagement[]>(sortedList)
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()

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
						engagement.contact.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						engagement.contact.name.last.toLowerCase().indexOf(searchStr) > -1
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

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.myRequestList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={5}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName='Add Request'
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewRequestPanel()}
				/>
			</div>
			<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewRequestPanel()}>
				<AddRequestForm />
			</Panel>
			<RequestPanel
				openPanel={isOpen}
				onDismiss={() => dismissRequestPanel()}
				request={engagement}
			/>
		</>
	)
}
