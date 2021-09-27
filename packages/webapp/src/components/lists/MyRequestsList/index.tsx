/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect, memo, Fragment } from 'react'
import CardRowTitle from '~components/ui/CardRowTitle'
import EditRequestForm from '~forms/EditRequestForm'
import useWindowSize from '~hooks/useWindowSize'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'
import Panel from '~ui/Panel'
import ComponentProps from '~types/ComponentProps'
import type { Engagement, EngagementInput } from '@cbosuite/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import UsernameTag from '~ui/UsernameTag'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

interface MyRequestListProps extends ComponentProps {
	title: string
	requests: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
	onEdit?: (form: any) => void
}

const MyRequests = memo(function MyRequests({
	title,
	requests,
	loading,
	onEdit,
	onPageChange
}: MyRequestListProps): JSX.Element {
	const { t, c } = useTranslation('requests')
	const history = useHistory()
	const { isMD } = useWindowSize()
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)

	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useEffect(() => {
		if (requests) setFilteredList(requests)
	}, [requests])

	const openRequestDetails = (eid: string) => {
		history.push(`${history.location.pathname}?engagement=${eid}`, history.location.state)
	}

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(requests)
			} else {
				const filteredEngagementList = requests.filter(
					(engagement: Engagement) =>
						engagement.contacts.some((contact) =>
							contact.name.first.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						engagement.contacts.some((contact) =>
							contact.name.last.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						engagement.title.toLowerCase().includes(searchStr.toLowerCase())
				)
				setFilteredList(filteredEngagementList)
			}
		},
		[requests]
	)

	const handleEdit = (values: EngagementInput) => {
		dismissEditRequestPanel()
		onEdit?.(values)
	}

	const columnActionButtons: IMultiActionButtons<Engagement>[] = [
		{
			name: t('requestListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick: function onActionClick(engagement: Engagement) {
				setSelectedEngagement(engagement)
				openEditRequestPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'title',
			name: t('requestListColumns.title'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement) {
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
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement) {
				return (
					<div className='d-flex'>
						{engagement.contacts.map((contact, index) => (
							<Fragment key={index}>
								<CardRowTitle
									tag='span'
									title={`${contact.name.first} ${contact.name.last}`}
									titleLink='/'
									onClick={() => {
										history.push(
											`${history.location.pathname}?contact=${contact.id}`,
											history.location.state
										)
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
			key: 'timeDuration',
			name: t('requestListColumns.timeRemaining'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				const { duration, unit } = getTimeDuration(new Date().toISOString(), engagement.endDate)
				if (unit === 'Overdue') {
					return c(`utils.getTimeDuration.${unit.toLowerCase()}`)
				}

				const translatedUnit = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
				return `${duration} ${translatedUnit}`
			}
		},
		{
			key: 'status',
			name: t('requestListColumns.status'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				if (engagement.user) {
					return (
						<div>
							{t('requestStatus.assigned')}:{' '}
							<UsernameTag
								userId={engagement.user.id}
								userName={engagement.user.userName}
								identifier='specialist'
							/>
						</div>
					)
				} else {
					return t('requestStatus.notStarted')
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
				const { duration, unit } = getTimeDuration(new Date().toISOString(), engagement.endDate)
				let timeRemaining = ''
				if (unit === 'Overdue') {
					timeRemaining = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
				} else {
					const translatedUnit = c(`utils.getTimeDuration.${unit.toLowerCase()}`)
					timeRemaining = `${duration} ${translatedUnit}`
				}

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
														history.push(
															`${router.pathname}?contact=${contact.id}`,
															history.location.state
														)
													}}
												/>
												{index < engagement.contacts.length - 1 && <span>&#44;&nbsp;</span>}
											</Fragment>
										))}
									</div>
								</Row>
								<Row className='ps-2'>
									<Col>
										<Row className='text-gray-5'>{t('requestListColumns.timeRemaining')}</Row>
										<Row>{timeRemaining}</Row>
									</Col>
									<Col>
										<Row className='text-gray-5'>
											{engagement?.user
												? t('requestStatus.assigned')
												: t('requestListColumns.status')}
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
			<div className={cx('mt-5 mb-5')}>
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
					collapsibleStateName='isMyRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={engagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</ClientOnly>
	)
})
export default wrap(MyRequests)
