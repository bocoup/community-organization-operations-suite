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
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'
import UserCardRow from '~components/ui/UserCardRow'
import { Col, Row } from 'react-bootstrap'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import UsernameTag from '~ui/UsernameTag'
import { useRouter } from 'next/router'
import { wrap } from '~utils/appinsights'

interface RequestListProps extends ComponentProps {
	title: string
	requests?: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
	onEdit: (form: any) => void
	onClaim: (form: any) => void
}

const RequestList = memo(function RequestList({
	title,
	requests,
	loading,
	onEdit,
	onClaim,
	onPageChange
}: RequestListProps): JSX.Element {
	const { t, c } = useTranslation('requests')
	const { isMD } = useWindowSize()
	const router = useRouter()
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()

	useEffect(() => {
		if (requests) {
			setFilteredList(requests)
		}
	}, [requests])

	const openRequestDetails = (eid: string) => {
		router.push(`${router.pathname}?engagement=${eid}`, undefined, { shallow: true })
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

	const handleEdit = (values: EngagementInput) => {
		dismissEditRequestPanel()
		onEdit?.(values)
	}

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
										router.push(`${router.pathname}?contact=${contact.id}`, undefined, {
											shallow: true
										})
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
			onRenderColumnItem(engagement: Engagement, index: number) {
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
			onRenderColumnItem(engagement: Engagement, index: number) {
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
			onRenderColumnItem(item: Engagement) {
				const columnActionButtons: IMultiActionButtons<Engagement>[] = [
					{
						name: t('requestListRowActions.claim'),
						className: cx(styles.editButton),
						isHidden: !!item?.user,
						onActionClick(engagement: Engagement) {
							onClaim?.(engagement)
						}
					},
					{
						name: t('requestListRowActions.edit'),
						className: cx(styles.editButton),
						onActionClick(engagement: Engagement) {
							setSelectedEngagement(engagement)
							openEditRequestPanel()
						}
					}
				]
				return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem(engagement: Engagement, index: number) {
				const columnActionButtons: IMultiActionButtons<Engagement>[] = [
					{
						name: t('requestListRowActions.claim'),
						className: `${cx(styles.editButton)} me-0 mb-2`,
						isHidden: !!engagement?.user,
						onActionClick(engagement: Engagement) {
							onClaim?.(engagement)
						}
					},
					{
						name: t('requestListRowActions.edit'),
						className: cx(styles.editButton),
						onActionClick(engagement: Engagement) {
							setSelectedEngagement(engagement)
							openEditRequestPanel()
						}
					}
				]

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
														router.push(`${router.pathname}?contact=${contact.id}`, undefined, {
															shallow: true
														})
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
									<Col className={cx('d-flex justify-content-end flex-column align-items-end')}>
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
					collapsibleStateName='isRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={selectedEngagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</ClientOnly>
	)
})
export default wrap(RequestList)
