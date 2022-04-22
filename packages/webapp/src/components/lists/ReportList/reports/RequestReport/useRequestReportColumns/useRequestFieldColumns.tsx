/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact, Engagement } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import styles from '../../../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { ShortString } from '~components/ui/ShortString'
import { TagBadgeList } from '~ui/TagBadgeList'
import { useRecoilValue } from 'recoil'
import { fieldFiltersState, organizationState } from '~store'
import { useGetValue } from '~components/lists/ReportList/hooks'
import { sortByAlphanumeric, sortByDate, sortByTags } from '~utils/sorting'
import { truncate } from 'lodash'

export function useRequestFieldColumns(
	filterColumns: (columnId: string, value: string[]) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	hiddenFields: Record<string, boolean>,
	onTrackEvent?: (name?: string) => void
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Requests)
	const [locale] = useLocale()
	const org = useRecoilValue(organizationState)
	const fieldFilters = useRecoilValue(fieldFiltersState)
	const { getSelectedValue, getStringValue } = useGetValue(fieldFilters)

	const statusList = useMemo(
		() => [
			{
				key: 'open',
				text: t('requestStatus.open')
			},
			{
				key: 'assigned',
				text: t('requestStatus.assigned')
			},
			{
				key: 'completed',
				text: t('requestStatus.completed')
			},
			{
				key: 'closed',
				text: t('requestStatus.closed')
			}
		],
		[t]
	)

	return useMemo((): IPaginatedTableColumn[] => {
		const _pageColumns: IPaginatedTableColumn[] = [
			{
				key: 'title',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.title'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return <ShortString text={item?.title} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(engagement: Engagement) {
					return truncate(engagement?.title, {
						length: 80,
						separator: ' '
					})
				}
			},
			{
				key: 'requestTags',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.requestTags'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={org?.tags?.map((tag) => {
								return {
									key: tag.id,
									text: tag.label
								}
							})}
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return <TagBadgeList tags={item?.tags} />
				},
				isSortable: true,
				sortingFunction: sortByTags,
				sortingValue(engagement: Engagement) {
					return engagement?.tags
				}
			},
			{
				key: 'description',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.description'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return <ShortString text={item?.description} />
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(engagement: Engagement) {
					return truncate(engagement?.description, {
						length: 80,
						separator: ' '
					})
				}
			},
			{
				key: 'startDate',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.startDate'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomDateRangeFilter
							defaultSelectedDates={getSelectedValue(key) as [string, string]}
							filterLabel={name}
							onFilterChanged={({ startDate, endDate }) => {
								const sDate = startDate ? startDate.toISOString() : ''
								const eDate = endDate ? endDate.toISOString() : ''
								filterRangedValues(key, [sDate, eDate])
							}}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item.startDate ? new Date(item.startDate).toLocaleDateString(locale) : ''
				},
				isSortable: true,
				sortingFunction: sortByDate,
				sortingValue(engagement: Engagement) {
					return { date: engagement?.startDate } // See '~utils/sorting'
				}
			},
			{
				key: 'endDate',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.endDate'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomDateRangeFilter
							defaultSelectedDates={getSelectedValue(key) as [string, string]}
							filterLabel={name}
							onFilterChanged={({ startDate, endDate }) => {
								const sDate = startDate ? startDate.toISOString() : ''
								const eDate = endDate ? endDate.toISOString() : ''
								filterRangedValues(key, [sDate, eDate])
							}}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item.endDate ? new Date(item.endDate).toLocaleDateString(locale) : ''
				},
				isSortable: true,
				sortingFunction: sortByDate,
				sortingValue(engagement: Engagement) {
					return { date: engagement?.endDate } // See '~utils/sorting'
				}
			},
			{
				key: 'status',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.status'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={statusList}
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return `${item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase()}`
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return `${
						contact?.status.charAt(0).toUpperCase() + contact?.status.slice(1).toLowerCase()
					}`
				}
			},
			{
				key: 'specialist',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.specialist'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item?.user?.userName || ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item: Engagement) {
					return item?.user?.userName || ''
				}
			}
		]

		return _pageColumns.filter((col) => !hiddenFields?.[col.key])
	}, [
		filterColumnTextValue,
		filterRangedValues,
		getSelectedValue,
		getStringValue,
		locale,
		t,
		org,
		filterColumns,
		statusList,
		hiddenFields,
		onTrackEvent
	])
}
