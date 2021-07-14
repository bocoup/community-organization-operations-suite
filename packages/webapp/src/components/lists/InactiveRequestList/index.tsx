/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect, memo } from 'react'
import CardRowTitle from '~components/ui/CardRowTitle'
import RequestPanel from '~components/ui/RequestPanel'
import useWindowSize from '~hooks/useWindowSize'
import ShortString from '~ui/ShortString'
import ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@resolve/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
interface InactiveRequestListProps extends ComponentProps {
	title: string
	requests?: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
}

const InactiveRequestList = memo(function InactiveRequestList({
	title,
	requests,
	loading,
	onPageChange
}: InactiveRequestListProps): JSX.Element {
	const { t } = useTranslation('requests')
	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openRequestPanel, setFalse: dismissRequestPanel }] = useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useEffect(() => {
		if (requests) {
			setFilteredList(requests)
		}
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

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('request.list.columns.name'),
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
			name: t('request.list.columns.request'),
			className: 'col-5',
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				return <ShortString text={engagement.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'closedDate',
			name: t('request.list.columns.closedDate'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				return new Date(engagement.endDate).toLocaleDateString()
			}
		},
		{
			key: 'lastUpdatedBy',
			name: t('request.list.columns.lastUpdatedBy'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				if (engagement.actions.length > 0) {
					return (
						<div>
							<span className='text-primary'>@{engagement.actions[0].user.userName}</span>
						</div>
					)
				}
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
										<Row>{t('request.list.columns.closedDate')}</Row>
										<Row>{new Date(engagement.endDate).toLocaleDateString()}</Row>
									</Col>
									<Col>
										<Row>{t('request.list.columns.lastUpdatedBy')}</Row>
										<Row className='text-primary'>
											{engagement.actions.length > 0 && `@${engagement.actions[0].user.userName}`}
										</Row>
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
						onSearchValueChange={value => searchList(value)}
						onPageChange={onPageChange}
						isLoading={loading}
					/>
				) : (
					<PaginatedList
						title={title}
						list={filteredList}
						itemsPerPage={5}
						columns={mobileColumn}
						hideListHeaders={true}
						onSearchValueChange={value => searchList(value)}
						onPageChange={onPageChange}
						isMD={false}
						isLoading={loading}
					/>
				)}
			</div>
			<RequestPanel
				openPanel={isOpen}
				onDismiss={dismissRequestPanel}
				request={selectedEngagement}
			/>
		</ClientOnly>
	)
})
export default InactiveRequestList
