/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { IPaginatedListColumn } from '~components/ui/PaginatedList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { UsernameTag } from '~ui/UsernameTag'
import { EngagementTitleColumnItem } from '~ui/EngagementTitleColumnItem'
import { EngagementClientsColumnItem } from '../../ui/EngagementClientsColumnItem'
import { MobileCard } from './MobileCard'

export function usePageColumns(): IPaginatedListColumn[] {
	const { t } = useTranslation(Namespace.Requests)
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
				key: 'closedDate',
				name: t('requestListColumns.closedDate'),
				onRenderColumnItem(engagement: Engagement) {
					return new Date(engagement.endDate).toLocaleDateString()
				}
			},
			{
				key: 'lastUpdatedBy',
				name: t('requestListColumns.lastUpdatedBy'),
				onRenderColumnItem(engagement: Engagement) {
					if (engagement.actions.length > 0) {
						return (
							<UsernameTag
								userId={engagement.actions[0].user.id}
								userName={engagement.actions[0].user.userName}
								identifier='specialist'
							/>
						)
					}
				}
			},
			{
				key: 'actions',
				name: '',
				className: 'd-flex justify-content-end'
			}
		],
		[t]
	)
}

export function useMobileColumns() {
	return mobileColumns
}

const mobileColumns: IPaginatedListColumn[] = [
	{
		key: 'cardItem',
		name: 'cardItem',
		onRenderColumnItem(engagement: Engagement) {
			return <MobileCard engagement={engagement} />
		}
	}
]
