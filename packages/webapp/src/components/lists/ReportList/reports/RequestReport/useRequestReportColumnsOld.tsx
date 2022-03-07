/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact, Engagement } from '@cbosuite/schema/dist/client-types'
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import styles from '../../index.module.scss'
import { useClientReportColumns } from '../ClientReport/useClientReportColumns'

function useRequestReportColumnsHelper(
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Requests)
	const [locale] = useLocale()

	return useMemo((): IPaginatedTableColumn[] => {
		const _pageColumns: IPaginatedTableColumn[] = [
			{
				key: 'title',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.title'),
				onRenderColumnHeader(key, name, indexd) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return `${item?.title}`
				}
			},
			{
				key: 'description',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.description'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return `${item?.description}`
				}
			},
			{
				key: 'startDate',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.startDate'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomDateRangeFilter
							filterLabel={name}
							onFilterChanged={({ startDate, endDate }) => {
								const sDate = startDate ? startDate.toISOString() : ''
								const eDate = endDate ? endDate.toISOString() : ''
								filterRangedValues(key, [sDate, eDate])
							}}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item.startDate ? new Date(item.startDate).toLocaleDateString(locale) : ''
				}
			},
			{
				key: 'endDate',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.endDate'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomDateRangeFilter
							filterLabel={name}
							onFilterChanged={({ startDate, endDate }) => {
								const sDate = startDate ? startDate.toISOString() : ''
								const eDate = endDate ? endDate.toISOString() : ''
								filterRangedValues(key, [sDate, eDate])
							}}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item.endDate ? new Date(item.endDate).toLocaleDateString(locale) : ''
				}
			},
			{
				key: 'status',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.status'),
				onRenderColumnHeader(key, name, index) {
					// TODO: add status options
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return getDemographicValue('race', item)
				}
			},
			{
				key: 'specialist',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('requestListColumns.specialist'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Engagement) {
					return item?.user?.userName || ''
				}
			}
		]

		const returnColumns = _pageColumns.filter((col) => !hiddenFields?.[col.key])
		return returnColumns
	}, [
		filterColumnTextValue,
		filterRangedValues,
		locale,
		t,
		getDemographicValue,
		// filterColumns,
		hiddenFields
	])
}

export function useRequestReportColumns(
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const clientReportColumns = useClientReportColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)
	const requestReportColumns = useRequestReportColumnsHelper(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)

	return [...clientReportColumns, ...requestReportColumns]
}
