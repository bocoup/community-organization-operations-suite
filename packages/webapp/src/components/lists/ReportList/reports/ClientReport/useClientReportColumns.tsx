/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import type { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { TagBadgeList } from '~ui/TagBadgeList'
import { useRecoilValue } from 'recoil'
import { fieldFiltersState, organizationState } from '~store'
import styles from '../../index.module.scss'
import { useGetValue } from '../../hooks'
import { getContactTitle } from '~components/lists/ContactList/ContactTitle'
import { sortByAlphanumeric, sortByDate, sortByTags } from '~utils/sorting'

export function useClientReportColumns(
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients)
	const [locale] = useLocale()
	const org = useRecoilValue(organizationState)
	const fieldFilters = useRecoilValue(fieldFiltersState)
	const { getSelectedValue, getStringValue } = useGetValue(fieldFilters)

	return useMemo((): IPaginatedTableColumn[] => {
		const _pageColumns: IPaginatedTableColumn[] = [
			{
				key: 'name',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('clientList.columns.name'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return `${item?.name?.first} ${item?.name?.last}`
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getContactTitle(contact, t)
				}
			},
			{
				key: 'tags',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.tags'),
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
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return <TagBadgeList tags={item?.tags} />
				},
				isSortable: true,
				sortingFunction: sortByTags,
				sortingValue(contact: Contact) {
					return contact?.tags
				}
			},
			{
				key: 'gender',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.gender.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => {
								return {
									key: o.key,
									text: t(`demographics.${key}.options.${o.key}`)
								}
							})}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('gender', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('gender', contact)
				}
			},
			{
				key: 'dateOfBirth',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.birthdate'),
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
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString(locale) : ''
				},
				isSortable: true,
				sortingFunction: sortByDate,
				sortingValue(contact: Contact) {
					return { date: contact.dateOfBirth } // See '~utils/sorting'
				}
			},
			{
				key: 'race',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.race.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('race', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('race', contact)
				}
			},
			{
				key: 'ethnicity',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.ethnicity.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
								key: o.key,
								text: t(`demographics.${key}.options.${o.key}`)
							}))}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('ethnicity', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('ethnicity', contact)
				}
			},
			{
				key: 'preferredLanguage',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.preferredLanguage.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
								key: o.key,
								text: t(`demographics.${key}.options.${o.key}`)
							}))}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('preferredLanguage', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('preferredLanguage', contact)
				}
			},
			{
				key: 'preferredContactMethod',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.preferredContactMethod.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
								key: o.key,
								text: t(`demographics.${key}.options.${o.key}`)
							}))}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('preferredContactMethod', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('preferredContactMethod', contact)
				}
			},
			{
				key: 'preferredContactTime',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.preferredContactTime.label'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomOptionsFilter
							defaultSelectedKeys={getSelectedValue(key) as string[]}
							filterLabel={name}
							placeholder={name}
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
								key: o.key,
								text: t(`demographics.${key}.options.${o.key}`)
							}))}
							onFilterChanged={(option) => filterColumns(key, option)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return getDemographicValue('preferredContactTime', item)
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return getDemographicValue('preferredContactTime', contact)
				}
			},
			{
				key: 'street',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.street'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.street ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.street ?? ''
				}
			},
			{
				key: 'unit',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.unit'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.unit ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.unit ?? ''
				}
			},
			{
				key: 'city',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.city'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.city ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.city ?? ''
				}
			},
			{
				key: 'county',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.county'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.county ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.county ?? ''
				}
			},
			{
				key: 'state',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.state'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.state ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.state ?? ''
				}
			},
			{
				key: 'zip',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.zip'),
				onRenderColumnHeader(key, name) {
					return (
						<CustomTextFieldFilter
							defaultValue={getStringValue(key)}
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return item?.address?.zip
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.address?.zip ?? -1
				}
			}
		]

		const returnColumns = _pageColumns.filter((col) => !hiddenFields?.[col.key])
		return returnColumns
	}, [
		t,
		filterColumnTextValue,
		getSelectedValue,
		org?.tags,
		filterColumns,
		getDemographicValue,
		filterRangedValues,
		locale,
		getStringValue,
		hiddenFields
	])
}
