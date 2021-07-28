/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useState, useEffect, useRef, memo } from 'react'
import { useRecoilState } from 'recoil'
import { isRequestsListOpenState } from '~store'
import CardRowTitle from '~components/ui/CardRowTitle'
import EditRequestForm from '~forms/EditRequestForm'
import useWindowSize from '~hooks/useWindowSize'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'
import Panel from '~ui/Panel'
import ShortString from '~ui/ShortString'
import ComponentProps from '~types/ComponentProps'
import type { Engagement, EngagementInput } from '@resolve/schema/lib/client-types'
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
					e.contact.name.first.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.contact.name.last.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.description.toLowerCase().includes(searchStr.toLowerCase())
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
			key: 'timeDuration',
			name: t('request.list.columns.timeRemaining'),
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
			name: t('request.list.columns.status'),
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				if (engagement.user) {
					return (
						<div>
							{t('request.status.assigned')}:{' '}
							<UsernameTag
								userId={engagement.user.id}
								userName={engagement.user.userName}
								identifier='specialist'
							/>
						</div>
					)
				} else {
					return t('request.status.notStarted')
				}
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(item: Engagement) {
				const columnActionButtons: IMultiActionButtons<Engagement>[] = [
					{
						name: t('request.list.rowActions.claim'),
						className: cx(styles.editButton),
						isHidden: !!item?.user,
						onActionClick: function onActionClick(engagement: Engagement) {
							onClaim?.(engagement)
						}
					},
					{
						name: t('request.list.rowActions.edit'),
						className: cx(styles.editButton),
						onActionClick: function onActionClick(engagement: Engagement) {
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
			onRenderColumnItem: function onRenderColumnItem(engagement: Engagement, index: number) {
				const columnActionButtons: IMultiActionButtons<Engagement>[] = [
					{
						name: t('request.list.rowActions.claim'),
						className: cx(styles.editButton),
						isHidden: !!engagement?.user,
						onActionClick: function onActionClick(engagement: Engagement) {
							onClaim?.(engagement)
						}
					},
					{
						name: t('request.list.rowActions.edit'),
						className: cx(styles.editButton),
						onActionClick: function onActionClick(engagement: Engagement) {
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
						title={`${engagement.contact.name.first} ${engagement.contact.name.last}`}
						titleLink='/'
						body={
							<Col className='p-1'>
								<Row className='d-block ps-2 pt-2 mb-4'>
									<ShortString text={engagement.description} limit={90} />
								</Row>
								<Row className='ps-2'>
									<Col>
										<Row>{t('request.list.columns.timeRemaining')}</Row>
										<Row>{timeRemaining}</Row>
									</Col>
									<Col>
										<Row>
											{engagement?.user
												? t('request.status.assigned')
												: t('request.list.columns.status')}
										</Row>
										<Row className='text-primary'>
											{engagement?.user ? (
												<UsernameTag
													userId={engagement.user.id}
													userName={engagement.user.userName}
													identifier='specialist'
												/>
											) : (
												t('request.status.notStarted')
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

	const ref = useRef(null)
	const [isListOpen, setIsListOpen] = useRecoilState(isRequestsListOpenState)

	const handleCollapserClick = () => {
		if (!isListOpen) {
			!!ref && !!ref.current && window.scrollTo(0, ref.current.offsetTop)
		}
		setIsListOpen(!isListOpen)
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.requestList)}>
				<PaginatedList
					scrollRef={ref}
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 0}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					onPageChange={onPageChange}
					isLoading={loading}
					isMD={isMD}
					collapsible
					isOpen={isListOpen}
					handleCollapserClick={handleCollapserClick}
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('request.editButton')}
					engagement={selectedEngagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</ClientOnly>
	)
})
export default RequestList
