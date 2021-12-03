/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { getTimeDuration } from '~utils/getTimeDuration'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { EngagementTitleColumnItem } from '~components/ui/EngagementTitleColumnItem'
import { EngagementClientsColumnItem } from '~components/ui/EngagementClientsColumnItem'
import { EngagementStatusColumnItem } from '~components/ui/EngagementStatusColumnItem'
import { MobileCard } from './MobileCard'

export function usePageColumns(
	onClaim: (engagement: Engagement) => void,
	onEdit: (Engagement: Engagement) => void
): IPaginatedListColumn[] {
	const { t, c } = useTranslation(Namespace.Requests)
	return useMemo(
		() => [
			{
				key: 'title',
				name: t('requestListColumns.title'),
				onRenderColumnItem(engagement: Engagement) {
					return <EngagementTitleColumnItem engagement={engagement} />
				}
			},
			{
				key: 'clients',
				name: t('requestListColumns.clients'),
				className: 'col-4',
				onRenderColumnItem(engagement: Engagement) {
					return <EngagementClientsColumnItem engagement={engagement} />
				}
			},
			{
				key: 'timeDuration',
				name: t('requestListColumns.timeRemaining'),
				onRenderColumnItem(engagement: Engagement) {
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
				onRenderColumnItem(engagement: Engagement) {
					return <EngagementStatusColumnItem engagement={engagement} />
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
							onActionClick: onClaim
						},
						{
							name: t('requestListRowActions.edit'),
							className: cx(styles.editButton),
							onActionClick: onEdit
						}
					]
					return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
				}
			}
		],
		[t, c, onClaim, onEdit]
	)
}

export function useMobileColumns(
	onClaim: (engagement: Engagement) => void,
	onEdit: (Engagement: Engagement) => void
): IPaginatedListColumn[] {
	const { t } = useTranslation(Namespace.Requests)
	return useMemo(
		() => [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(engagement: Engagement, index: number) {
					const columnActionButtons: IMultiActionButtons<Engagement>[] = [
						{
							name: t('requestListRowActions.claim'),
							className: `${cx(styles.editButton)} me-0 mb-2`,
							isHidden: !!engagement?.user,
							onActionClick: onClaim
						},
						{
							name: t('requestListRowActions.edit'),
							className: cx(styles.editButton),
							onActionClick: onEdit
						}
					]

					return <MobileCard engagement={engagement} actions={columnActionButtons} />
				}
			}
		],
		[t, onClaim, onEdit]
	)
}
