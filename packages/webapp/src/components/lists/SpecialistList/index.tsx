/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { RoleType, User } from '@cbosuite/schema/dist/client-types'
import cx from 'classnames'
import { MultiActionButton, IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useWindowSize } from '~hooks/useWindowSize'
import { useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import { Panel } from '~ui/Panel'
import { AddSpecialistForm } from '~components/forms/AddSpecialistForm'
import { EditSpecialistForm } from '~components/forms/EditSpecialistForm'
import { PaginatedList, IPaginatedListColumn } from '~components/ui/PaginatedList'
import { useSpecialist } from '~hooks/api/useSpecialist'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useUserSearchHandler } from '~hooks/useUserSearchHandler'
import { SpecialistTitleColumnItem } from '~components/ui/SpecialistTitleColumnItem'
import { SpecialistMobileCard } from '~components/ui/SpecialistMobileCard'

interface SpecialistListProps {
	title?: string
}

export const SpecialistList: StandardFC<SpecialistListProps> = wrap(function SpecialistList({
	title
}) {
	const { t } = useTranslation('specialists')
	const { specialistList, loading } = useSpecialist()
	const { isAdmin } = useCurrentUser()
	const { isMD } = useWindowSize()
	const [isNewFormOpen, { setTrue: openNewSpecialistPanel, setFalse: dismissNewSpecialistPanel }] =
		useBoolean(false)
	const [
		isEditFormOpen,
		{ setTrue: openEditSpecialistPanel, setFalse: dismissEditSpecialistPanel }
	] = useBoolean(false)
	const [specialist, setSpecialist] = useState<User | undefined>()
	const [filteredList, setFilteredList] = useState<User[]>(specialistList)
	const onPanelClose = () => {
		dismissNewSpecialistPanel()
		dismissEditSpecialistPanel()
	}

	const searchList = useUserSearchHandler(specialistList, setFilteredList)

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
				return <SpecialistTitleColumnItem user={user} />
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
			onRenderColumnItem(user: User) {
				return <SpecialistMobileCard user={user} actions={columnActionButtons} />
			}
		}
	]

	return (
		<div className={cx('mt-5 mb-5', styles.specialistList, 'specialistList')}>
			<PaginatedList
				title={title}
				hideListHeaders={!isMD}
				list={filteredList}
				itemsPerPage={isMD ? 20 : 10}
				columns={isMD ? pageColumns : mobileColumn}
				rowClassName='align-items-center'
				addButtonName={t('specialistAddButton')}
				onSearchValueChange={searchList}
				onListAddButtonClick={openNewSpecialistPanel}
				isLoading={loading && filteredList.length === 0}
			/>
			<Panel openPanel={isNewFormOpen} onDismiss={onPanelClose}>
				<AddSpecialistForm title={t('specialistAddButton')} closeForm={onPanelClose} />
			</Panel>
			<Panel openPanel={isEditFormOpen && isAdmin} onDismiss={onPanelClose}>
				<EditSpecialistForm
					title={t('specialistEditButton')}
					specialist={specialist}
					closeForm={onPanelClose}
				/>
			</Panel>
		</div>
	)
})
