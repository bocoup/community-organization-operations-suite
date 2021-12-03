/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MultiActionButton, IMultiActionButtons } from '~ui/MultiActionButton2'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import { getTimeDuration } from '~utils/getTimeDuration'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { EngagementTitleColumnItem } from '~components/ui/EngagementTitleColumnItem'
import { EngagementClientsColumnItem } from '~components/ui/EngagementClientsColumnItem'
import { EngagementStatusColumnItem } from '~components/ui/EngagementStatusColumnItem'
import { MobileCard } from './MobileCard'
import { useMemo } from 'react'

export function usePageColumns(actions: Array<IMultiActionButtons<Engagement>>) {
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
					return <MultiActionButton columnItem={item} buttonGroup={actions} />
				}
			}
		],
		[actions, t, c]
	)
}

export function useMobileColumns(actions: Array<IMultiActionButtons<Engagement>>) {
	return useMemo(
		() => [
			{
				key: 'cardItem',
				name: 'cardItem',
				onRenderColumnItem(engagement: Engagement) {
					return <MobileCard engagement={engagement} actions={actions} />
				}
			}
		],
		[actions]
	)
}
