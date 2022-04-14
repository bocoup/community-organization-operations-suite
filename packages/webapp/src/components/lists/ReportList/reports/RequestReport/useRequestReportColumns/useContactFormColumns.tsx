/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import styles from '../../../index.module.scss'
import { CustomDateRangeFilter } from '~components/ui/CustomDateRangeFilter'
import { TagBadgeList } from '~ui/TagBadgeList'
import { useLocale } from '~hooks/useLocale'
import { useRecoilValue } from 'recoil'
import { fieldFiltersState, organizationState } from '~store'
import { useGetValue } from '~components/lists/ReportList/hooks'
import { sortByAlphanumeric, sortByDate, sortByTags } from '~utils/sorting'

export function useContactFormColumns(
	filterColumns: (columnId: string, value: string[]) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>,
	onTrackEvent?: (name?: string) => void
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	const [locale] = useLocale()
	const org = useRecoilValue(organizationState)
	const fieldFilters = useRecoilValue(fieldFiltersState)
	const { getSelectedValue, getStringValue } = useGetValue(fieldFilters)

	return useMemo(() => {
		const columns = [
			{
				key: 'firstname',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('clientList.columns.firstname'),
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
				onRenderColumnItem(item) {
					return item?.contacts[0]?.name?.first
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.name?.first
				}
			},
			{
				key: 'lastname',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('clientList.columns.lastname'),
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
				onRenderColumnItem(item) {
					return item?.contacts[0]?.name?.last
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.name?.last
				}
			},
			{
				key: 'tags',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.clientTags'),
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
				onRenderColumnItem(item) {
					return <TagBadgeList tags={item?.contacts[0]?.tags} />
				},
				isSortable: true,
				sortingFunction: sortByTags,
				sortingValue(item) {
					return item?.contacts[0]?.tags
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
							options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
								key: o.key,
								text: t(`demographics.${key}.options.${o.key}`)
							}))}
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('gender', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('gender', item?.contacts[0])
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.dateOfBirth
						? new Date(item?.contacts[0]?.dateOfBirth).toLocaleDateString(locale)
						: ''
				},
				isSortable: true,
				sortingFunction: sortByDate,
				sortingValue(item) {
					return { date: item?.contacts[0]?.dateOfBirth } // See '~utils/sorting'
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('race', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('race', item?.contacts[0])
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
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('ethnicity', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('ethnicity', item?.contacts[0])
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
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('preferredLanguage', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('preferredLanguage', item?.contacts[0])
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
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('preferredContactMethod', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('preferredContactMethod', item?.contacts[0])
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
							onFilterChanged={(value) => filterColumns(key, value)}
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return getDemographicValue('preferredContactTime', item?.contacts[0])
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return getDemographicValue('preferredContactTime', item?.contacts[0])
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.street ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.street ?? ''
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.unit ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.unit ?? ''
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.city ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.city ?? ''
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.county ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.county ?? ''
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.state ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.state ?? ''
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
							onTrackEvent={onTrackEvent}
						/>
					)
				},
				onRenderColumnItem(item) {
					return item?.contacts[0]?.address?.zip
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(item) {
					return item?.contacts[0]?.address?.zip ?? -1
				}
			},
			{
				key: 'notes',
				headerClassName: styles.headerItemCell,
				itemClassName: styles.itemCell,
				name: t('customFilters.notes'),
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
				onRenderColumnItem(item: Contact) {
					return item?.notes ?? ''
				},
				isSortable: true,
				sortingFunction: sortByAlphanumeric,
				sortingValue(contact: Contact) {
					return contact?.notes ?? ''
				}
			}
		]

		return columns.filter((col) => !hiddenFields?.[col.key])
	}, [
		filterColumnTextValue,
		filterColumns,
		filterRangedValues,
		getDemographicValue,
		getSelectedValue,
		getStringValue,
		t,
		hiddenFields,
		locale,
		org,
		onTrackEvent
	])
}
