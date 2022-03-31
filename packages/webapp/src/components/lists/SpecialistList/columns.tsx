/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { User } from '@cbosuite/schema/dist/client-types'
import { RoleType } from '@cbosuite/schema/dist/client-types'
import type { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { MultiActionButton } from '~components/ui/MultiActionButton2'
import { useMemo } from 'react'
import type { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { SpecialistTitleColumnItem } from '~components/ui/SpecialistTitleColumnItem'
import { SpecialistMobileCard } from '~components/ui/SpecialistMobileCard'

export function usePageColumns(actions: IMultiActionButtons<User>[]): IPaginatedListColumn[] {
	const { t } = useTranslation(Namespace.Specialists)
	return useMemo(
		() => [
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
				className: 'col-1',
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
				className: 'col-1 d-flex justify-content-end',
				onRenderColumnItem(user: User) {
					return <MultiActionButton columnItem={user} buttonGroup={actions} />
				}
			}
		],
		[actions, t]
	)
}

export function useMobileColumns(actions: IMultiActionButtons<User>[]): IPaginatedListColumn[] {
	return useMemo(
		() => [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(user: User) {
					return <SpecialistMobileCard user={user} actions={actions} />
				}
			}
		],
		[actions]
	)
}
