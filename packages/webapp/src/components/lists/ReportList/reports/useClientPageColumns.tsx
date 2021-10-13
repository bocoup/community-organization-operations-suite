/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { IPaginatedTableColumn } from '~components/ui/PaginatedTable'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { useLocale } from '~hooks/useLocale'
import { useTranslation } from '~hooks/useTranslation'
import styles from '../index.module.scss'

export function useClientPageColumns(
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string
) {
	const { t } = useTranslation(['reporting', 'clients'])
	const [locale] = useLocale()

	return useMemo((): IPaginatedTableColumn[] => {
		const _pageColumns: IPaginatedTableColumn[] = [
			{
				key: 'name',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('clientList.columns.name'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact) {
					return `${item?.name?.first} ${item?.name?.last}`
				}
			},
			{
				key: 'gender',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.gender.label'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomOptionsFilter
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
				onRenderColumnItem(item: Contact, index: number) {
					return getDemographicValue('gender', item)
				}
			},
			{
				key: 'race',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.race.label'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomOptionsFilter
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
				onRenderColumnItem(item: Contact, index: number) {
					return getDemographicValue('race', item)
				}
			},
			{
				key: 'ethnicity',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('demographics.ethnicity.label'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomOptionsFilter
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
				onRenderColumnItem(item: Contact, index: number) {
					return getDemographicValue('ethnicity', item)
				}
			},
			{
				key: 'dateOfBirth',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.birthdate'),
				onRenderColumnHeader(key, name, index) {
					const birthDateLimit = new Date()
					return (
						<CustomDateRangeFilter
							filterLabel={name}
							minStartDate={birthDateLimit}
							maxEndDate={birthDateLimit}
							onFilterChanged={({ startDate, endDate }) => {
								const sDate = startDate ? startDate.toISOString() : ''
								const eDate = endDate ? endDate.toISOString() : ''
								filterRangedValues(key, [sDate, eDate])
							}}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return new Date(item.dateOfBirth).toLocaleDateString(locale)
				}
			},
			{
				key: 'city',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.city'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return item?.address?.city
				}
			},
			{
				key: 'county',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.county'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return item?.address?.county
				}
			},
			{
				key: 'state',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.state'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return item?.address?.state
				}
			},
			{
				key: 'zip',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.zip'),
				onRenderColumnHeader(key, name, index) {
					return (
						<CustomTextFieldFilter
							filterLabel={name}
							onFilterChanged={(value) => filterColumnTextValue(key, value)}
						/>
					)
				},
				onRenderColumnItem(item: Contact, index: number) {
					return item?.address?.zip
				}
			}
		]

		return _pageColumns
	}, [filterColumnTextValue, filterRangedValues, locale, t, getDemographicValue, filterColumns])
}
