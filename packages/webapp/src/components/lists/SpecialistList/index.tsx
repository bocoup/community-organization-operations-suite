/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { ComponentProps } from '~types/ComponentProps'
import { RoleType, User } from '@cbosuite/schema/dist/client-types'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useWindowSize } from '~hooks/useWindowSize'
import { UserCardRow } from '~components/ui/UserCardRow'
import { CardRowTitle } from '~ui/CardRowTitle'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel } from '~ui/Panel'
import { AddSpecialistForm } from '~components/forms/AddSpecialistForm'
import { EditSpecialistForm } from '~components/forms/EditSpecialistForm'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { useTranslation } from '~hooks/useTranslation'
import { useHistory } from 'react-router-dom'
import { wrap } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

interface SpecialistListProps extends ComponentProps {
	title?: string
}

export const SpecialistList = wrap(function SpecialistList({
	title
}: SpecialistListProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const history = useHistory()
	const { specialistList, loading } = useSpecialist()
	const { isAdmin } = useCurrentUser()
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
		history.push(`${history.location.pathname}?specialist=${selectedSpecialist.id}`)
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

	const columnActionButtons: IMultiActionButtons<User>[] = isAdmin
		? [
				{
					name: t('specialistListRowActions.edit'),
					className: cx(styles.editButton),
					onActionClick(user: User) {
						setSpecialist(user)
						openEditSpecialistPanel()
					}
				}
		  ]
		: []

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('specialistListColumns.name'),
			onRenderColumnItem(user: User) {
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
			onRenderColumnItem(user: User) {
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
			onRenderColumnItem(user: User) {
				return `@${user.userName}`
			}
		},
		{
			key: 'permissions',
			name: t('specialistListColumns.permissions'),
			onRenderColumnItem(user: User) {
				return (
					<>
						{user?.roles.filter((r) => r.roleType === RoleType.Admin).length > 0
							? t('specialistRoles.admin')
							: t('specialistRoles.user')}
					</>
				)
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem(user: User) {
				return <MultiActionButton columnItem={user} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem(user: User, index: number) {
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
		<div className={cx('mt-5 mb-5', styles.specialistList)} data-testid='specialist-list'>
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
			<Panel openPanel={isEditFormOpen && isAdmin} onDismiss={() => onPanelClose()}>
				<EditSpecialistForm
					title={t('specialistEditButton')}
					specialist={specialist}
					closeForm={() => onPanelClose()}
				/>
			</Panel>
		</div>
	)
})
