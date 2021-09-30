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
import { memo, useMemo, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import Panel from '~ui/Panel'
import AddSpecialistForm from '~components/forms/AddSpecialistForm'
import EditSpecialistForm from '~components/forms/EditSpecialistForm'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

interface SpecialistListProps extends ComponentProps {
	title?: string
}

const SpecialistList = memo(function SpecialistList({ title }: SpecialistListProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const history = useHistory()
	const { specialistList, loading } = useSpecialist()

	const { isMD } = useWindowSize()
	const [isNewFormOpen, { setTrue: openNewSpecialistPanel, setFalse: dismissNewSpecialistPanel }] =
		useBoolean(false)

	const [
		isEditFormOpen,
		{ setTrue: openEditSpecialistPanel, setFalse: dismissEditSpecialistPanel }
	] = useBoolean(false)

	const [specialist, setSpecialist] = useState<User | undefined>()
	const [searchText, setSearchText] = useState<string>('')

	const filteredList = useMemo<User[]>(() => {
		function applyFilter(str: string, items: User[]) {
			if (str.length > 0) {
				return items.filter(
					(user: User) =>
						user.name.first.toLowerCase().indexOf(str) > -1 ||
						user.name.last.toLowerCase().indexOf(str) > -1
				)
			} else {
				return items
			}
		}
		if (!specialistList) {
			return []
		} else {
			let result = specialistList
			result = applyFilter(searchText, result)
			return result
		}
	}, [specialistList, searchText])

	const openSpecialistDetails = (selectedSpecialist: User) => {
		history.push(`${history.location.pathname}?specialist=${selectedSpecialist.id}`)
	}

	const onPanelClose = () => {
		dismissNewSpecialistPanel()
		dismissEditSpecialistPanel()
	}

	const columnActionButtons: IMultiActionButtons<User>[] = [
		{
			name: t('specialistListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(user: User) {
				setSpecialist(user)
				openEditSpecialistPanel()
			}
		}
	]

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
				onSearchValueChange={setSearchText}
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
	)
})
export default wrap(SpecialistList)
