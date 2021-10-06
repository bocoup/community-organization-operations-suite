/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useState, useEffect, Fragment } from 'react'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { useWindowSize } from '~hooks/useWindowSize'
import { StandardFC } from '~types/StandardFC'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { UserCardRow } from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'
import { UsernameTag } from '~ui/UsernameTag'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { navigate } from '~utils/navigate'

interface InactiveRequestListProps {
	title: string
	requests?: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
}

export const InactiveRequestList: StandardFC<InactiveRequestListProps> = wrap(
	function InactiveRequestList({ title, requests, loading, onPageChange }) {
		const { t } = useTranslation('requests')
		const history = useHistory()
		const { isMD } = useWindowSize()
		const [filteredList, setFilteredList] = useState<Engagement[]>(requests)

		useEffect(() => {
			if (requests) {
				setFilteredList(requests)
			}
		}, [requests])

		const openRequestDetails = (eid: string) => {
			navigate(history, history.location.pathname, { engagement: eid })
		}

		const searchList = useCallback(
			(searchStr: string) => {
				// TODO: implement search query
				const filteredEngagementList = requests.filter(
					(e: Engagement) =>
						e.contacts.some((contact) =>
							contact.name.first.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						e.contacts.some((contact) =>
							contact.name.last.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						e.title.toLowerCase().includes(searchStr.toLowerCase())
				)
				setFilteredList(filteredEngagementList)
			},
			[requests]
		)

		const pageColumns: IPaginatedListColumn[] = [
			{
				key: 'title',
				name: t('requestListColumns.title'),
				onRenderColumnItem(engagement: Engagement) {
					return (
						<CardRowTitle
							tag='span'
							title={engagement.title}
							titleLink='/'
							onClick={() => openRequestDetails(engagement.id)}
						/>
					)
				}
			},
			{
				key: 'clients',
				name: t('requestListColumns.clients'),
				className: 'col-4',
				onRenderColumnItem(engagement: Engagement) {
					return (
						<div className='d-flex'>
							{engagement.contacts.map((contact, index) => (
								<Fragment key={index}>
									<CardRowTitle
										tag='span'
										title={`${contact.name.first} ${contact.name.last}`}
										titleLink='/'
										onClick={() => {
											navigate(history, history.location.pathname, { contact: contact.id })
										}}
									/>
									{index < engagement.contacts.length - 1 && <span>&#44;&nbsp;</span>}
								</Fragment>
							))}
						</div>
					)
				}
			},
			{
				key: 'closedDate',
				name: t('requestListColumns.closedDate'),
				onRenderColumnItem(engagement: Engagement, index: number) {
					return new Date(engagement.endDate).toLocaleDateString()
				}
			},
			{
				key: 'lastUpdatedBy',
				name: t('requestListColumns.lastUpdatedBy'),
				onRenderColumnItem(engagement: Engagement, index: number) {
					if (engagement.actions.length > 0) {
						return (
							<UsernameTag
								userId={engagement.actions[0].user.id}
								userName={engagement.actions[0].user.userName}
								identifier='specialist'
							/>
						)
					}
				}
			},
			{
				key: 'actions',
				name: '',
				className: 'd-flex justify-content-end'
			}
		]

		const mobileColumn: IPaginatedListColumn[] = [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(engagement: Engagement, index: number) {
					return (
						<UserCardRow
							key={index}
							title={engagement.title}
							titleLink='/'
							body={
								<Col className='p-1'>
									<Row className='d-block ps-2 pt-2 mb-4'>
										<div className='d-flex g-0'>
											{engagement.contacts.map((contact, index) => (
												<Fragment key={index}>
													<CardRowTitle
														tag='span'
														title={`${contact.name.first} ${contact.name.last}`}
														titleLink='/'
														onClick={() => {
															navigate(history, history.location.pathname, { contact: contact.id })
														}}
													/>
													{index < engagement.contacts.length - 1 && <span>&#44;&nbsp;</span>}
												</Fragment>
											))}
										</div>
									</Row>
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
								</Col>
							}
							onClick={() => openRequestDetails(engagement.id)}
						/>
					)
				}
			}
		]

		return (
			<div className={cx('mt-5 mb-5', styles.requestList)} data-testid='inactive-requests-list'>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					onPageChange={onPageChange}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isInactiveRequestsListOpen'
				/>
			</div>
		)
	}
)
