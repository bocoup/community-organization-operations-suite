/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { User } from '@resolve/schema/lib/client-types'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import useWindowSize from '~hooks/useWindowSize'
import UserCardRow from '~components/ui/UserCardRow'
import CardRowTitle from '~ui/CardRowTitle'
import SpecialistPanel from '~components/ui/SpecialistPanel'
import SpecialistHeader from '~ui/SpecialistHeader'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import ShortString from '~components/ui/ShortString'
import Panel from '~ui/Panel'
import AddSpecialistForm from '~components/forms/AddSpecialistForm'
import EditSpecialistForm from '~components/forms/EditSpecialistForm'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useSpecialist } from '~hooks/api/useSpecialist'
import ClientOnly from '~components/ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'

interface SpecialistListProps extends ComponentProps {
	title?: string
}

const SpecialistList = memo(function SpecialistList({ title }: SpecialistListProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const { specialistList, refetch, loading } = useSpecialist()

	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openSpecialistPanel, setFalse: dismissSpecialistPanel }] =
		useBoolean(false)
	const [isNewFormOpen, { setTrue: openNewSpecialistPanel, setFalse: dismissNewSpecialistPanel }] =
		useBoolean(false)

	const [
		isEditFormOpen,
		{ setTrue: openEditSpecialistPanel, setFalse: dismissEditSpecialistPanel }
	] = useBoolean(false)

	const [specialist, setSpecialist] = useState<User | undefined>()

	const [filteredList, setFilteredList] = useState<User[]>(specialistList)

	const searchText = useRef<string>('')

	useEffect(() => {
		if (specialistList) {
			if (searchText.current === '') {
				setFilteredList(specialistList)
			} else {
				const searchStr = searchText.current
				const filteredUsers = specialistList.filter(
					(user: User) =>
						user.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						user.name.last.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredUsers)
			}
		}
	}, [specialistList, setFilteredList, searchText])

	const openSpecialistDetails = useCallback(
		(selectedSpecialist: User) => {
			setSpecialist(selectedSpecialist)
			openSpecialistPanel()
		},
		[openSpecialistPanel]
	)

	const onPanelClose = async () => {
		dismissNewSpecialistPanel()
		dismissEditSpecialistPanel()
		await refetch({})
	}

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(specialistList)
			} else {
				const filteredUsers = specialistList.filter(
					(user: User) =>
						user.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						user.name.last.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredUsers)
			}

			searchText.current = searchStr
		},
		[specialistList, searchText]
	)

	const columnActionButtons: IMultiActionButtons<User>[] = [
		{
			name: t('specialist.list.rowActions.edit'),
			className: cx(styles.editButton),
			onActionClick: function onActionClick(user: User) {
				setSpecialist(user)
				openEditSpecialistPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('specialist.list.columns.name'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<CardRowTitle
						tag='span'
						title={`${user.name.first} ${user.name.last}`}
						titleLink='/'
						onClick={() => openSpecialistDetails(user)}
					/>
				)
			}
		},
		{
			key: 'numOfEngagement',
			name: t('specialist.list.columns.numOfEngagement'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<span>
						{user?.engagementCounts?.active || 0} {t('specialist.status.assigned')},{' '}
						{user?.engagementCounts?.closed || 0} {t('specialist.status.closed')}
					</span>
				)
			}
		},
		{
			key: 'userName',
			name: t('specialist.list.columns.username'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return `@${user.userName}`
			}
		},
		{
			key: 'permissions',
			name: t('specialist.list.columns.permissions'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<ClientOnly>
						{user?.roles.filter(r => r.roleType === 'ADMIN').length > 0
							? t('specialist.roles.admin')
							: t('specialist.roles.user')}
					</ClientOnly>
				)
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return <MultiActionButton columnItem={user} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem: function onRenderColumnItem(user: User, index: number) {
				return (
					<UserCardRow
						key={index}
						title={`${user.name.first} ${user.name.last}`}
						titleLink='/'
						body={
							<Col>
								<Row className='ps-2'>@{user.userName}</Row>
								<Row className='ps-2 pb-4'>
									{user?.roles.filter(r => r.roleType === 'ADMIN').length > 0
										? t('specialist.roles.admin')
										: t('specialist.roles.user')}
								</Row>
								<Row className='ps-2'>
									<Col>
										<Row>{t('specialist.numOfAssignedEngagement')}</Row>
										<Row>{user?.engagementCounts?.active || 0}</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton columnItem={user} buttonGroup={columnActionButtons} />
									</Col>
								</Row>
							</Col>
						}
						onClick={() => openSpecialistDetails(user)}
					/>
				)
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.specialistList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 20 : 10}
					columns={isMD ? pageColumns : mobileColumn}
					rowClassName='align-items-center'
					addButtonName={t('specialist.addButton')}
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewSpecialistPanel()}
					isLoading={loading && filteredList.length === 0}
				/>
				<Panel openPanel={isNewFormOpen} onDismiss={() => onPanelClose()}>
					<AddSpecialistForm title={t('specialist.addButton')} closeForm={() => onPanelClose()} />
				</Panel>
				<Panel openPanel={isEditFormOpen} onDismiss={() => onPanelClose()}>
					<EditSpecialistForm
						title={t('specialist.editButton')}
						specialist={specialist}
						closeForm={() => onPanelClose()}
					/>
				</Panel>
				<SpecialistPanel openPanel={isOpen} onDismiss={() => dismissSpecialistPanel()}>
					<SpecialistHeader specialist={specialist} />
					<div className={cx(styles.specialistDetailsWrapper)}>
						<div className='mb-3 mb-lg-5'>
							<h3 className='mb-2 mb-lg-4 '>
								<strong>{t('viewSpecialist.body.bio')}</strong>
							</h3>
							{specialist?.description ? (
								<ShortString text={specialist.description} limit={240} />
							) : (
								<div>{t('viewSpecialist.body.noDetails')}</div>
							)}
						</div>
						<div className='mb-3 mb-lg-5'>
							<h3 className='mb-2 mb-lg-4 '>
								<strong>{t('viewSpecialist.body.trainingAchievement')}</strong>
							</h3>
							{specialist?.additionalInfo ? (
								<ShortString text={specialist.additionalInfo} limit={240} />
							) : (
								<div>{t('viewSpecialist.body.noDetails')}</div>
							)}
						</div>
					</div>
				</SpecialistPanel>
			</div>
		</ClientOnly>
	)
})
export default SpecialistList
