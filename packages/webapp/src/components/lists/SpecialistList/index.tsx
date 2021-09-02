/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { RoleType, User } from '@cbosuite/schema/dist/client-types'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import useWindowSize from '~hooks/useWindowSize'
import UserCardRow from '~components/ui/UserCardRow'
import CardRowTitle from '~ui/CardRowTitle'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import Panel from '~ui/Panel'
import AddSpecialistForm from '~components/forms/AddSpecialistForm'
import EditSpecialistForm from '~components/forms/EditSpecialistForm'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useSpecialist } from '~hooks/api/useSpecialist'
import ClientOnly from '~components/ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import { useRouter } from 'next/router'
import { wrap } from '~utils/appinsights'

interface SpecialistListProps extends ComponentProps {
	title?: string
}

const SpecialistList = memo(function SpecialistList({ title }: SpecialistListProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const router = useRouter()
	const { specialistList, loading } = useSpecialist()

	const { isMD } = useWindowSize()
	// const [isOpen, { setTrue: openSpecialistPanel, setFalse: dismissSpecialistPanel }] =
	// 	useBoolean(false)
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

	const openSpecialistDetails = (selectedSpecialist: User) => {
		router.push(`${router.pathname}?specialist=${selectedSpecialist.id}`, undefined, {
			shallow: true
		})
	}

	const onPanelClose = () => {
		dismissNewSpecialistPanel()
		dismissEditSpecialistPanel()
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
			name: t('specialistListRowActions.edit'),
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
			name: t('specialistListColumns.name'),
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
			name: t('specialistListColumns.numOfEngagement'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<span>
						{user?.engagementCounts?.active || 0} {t('specialistStatus.assigned')},{' '}
						{user?.engagementCounts?.closed || 0} {t('specialistStatus.closed')}
					</span>
				)
			}
		},
		{
			key: 'userName',
			name: t('specialistListColumns.username'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return `@${user.userName}`
			}
		},
		{
			key: 'permissions',
			name: t('specialistListColumns.permissions'),
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<ClientOnly>
						{user?.roles.filter((r) => r.roleType === RoleType.Admin).length > 0
							? t('specialistRoles.admin')
							: t('specialistRoles.user')}
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
									{user?.roles.filter((r) => r.roleType === RoleType.Admin).length > 0
										? t('specialistRoles.admin')
										: t('specialistRoles.user')}
								</Row>
								<Row className='ps-2'>
									<Col>
										<Row>{t('specialistNumOfAssignedEngagement')}</Row>
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
					hideListHeaders={!isMD}
					list={filteredList}
					itemsPerPage={isMD ? 20 : 10}
					columns={isMD ? pageColumns : mobileColumn}
					rowClassName='align-items-center'
					addButtonName={t('specialistAddButton')}
					onSearchValueChange={(value) => searchList(value)}
					onListAddButtonClick={() => openNewSpecialistPanel()}
					isLoading={loading && filteredList.length === 0}
				/>
				<Panel openPanel={isNewFormOpen} onDismiss={() => onPanelClose()}>
					<AddSpecialistForm title={t('specialistAddButton')} closeForm={() => onPanelClose()} />
				</Panel>
				<Panel openPanel={isEditFormOpen} onDismiss={() => onPanelClose()}>
					<EditSpecialistForm
						title={t('specialistEditButton')}
						specialist={specialist}
						closeForm={() => onPanelClose()}
					/>
				</Panel>
			</div>
		</ClientOnly>
	)
})
export default wrap(SpecialistList)
