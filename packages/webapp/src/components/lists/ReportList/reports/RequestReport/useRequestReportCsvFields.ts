/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, Engagement } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { CsvField } from '../../types'

export function useRequestReportCsvFields(
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Requests)
	const [locale] = useLocale()
	useEffect(() => {
		const csvFields = [
			{
				key: 'name',
				label: t('clientList.columns.name'),
				value: (item: Engagement) => {
					return `${item?.contacts?.[0]?.name?.first} ${item?.contacts?.[0]?.name?.last}`
				}
			},
			{
				key: 'tags',
				label: t('customFilters.tags'),
				value: (item: Engagement) => {
					if (item?.contacts?.[0]?.tags?.length > 0) {
						let tags = ''
						item.contacts[0].tags.forEach((tag) => {
							tags += tag.label + '|'
						})
						return tags.slice(0, -1)
					}
					return ''
				}
			},
			{
				key: 'gender',
				label: t('demographics.gender.label'),
				value: (item: Engagement) => getDemographicValue('gender', item?.contacts?.[0])
			},
			{
				key: 'dateOfBirth',
				label: t('customFilters.birthdate'),
				value: (item: Engagement) =>
					item?.contacts?.[0]?.dateOfBirth
						? new Date(item?.contacts?.[0]?.dateOfBirth).toLocaleDateString(locale)
						: ''
			},
			{
				key: 'race',
				label: t('demographics.race.label'),
				value: (item: Engagement) => getDemographicValue('race', item?.contacts?.[0])
			},
			{
				key: 'ethnicity',
				label: t('demographics.ethnicity.label'),
				value: (item: Engagement) => getDemographicValue('ethnicity', item?.contacts?.[0])
			},
			{
				key: 'preferredLanguage',
				label: t('demographics.preferredLanguage.label'),
				value: (item: Engagement) => getDemographicValue('preferredLanguage', item?.contacts?.[0])
			},
			{
				key: 'preferredContactMethod',
				label: t('demographics.preferredContactMethod.label'),
				value: (item: Engagement) =>
					getDemographicValue('preferredContactMethod', item?.contacts?.[0])
			},
			{
				key: 'preferredContactTime',
				label: t('demographics.preferredContactTime.label'),
				value: (item: Engagement) =>
					getDemographicValue('preferredContactTime', item?.contacts?.[0])
			},
			{
				key: 'street',
				label: t('customFilters.street'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.street
			},
			{
				key: 'unit',
				label: t('customFilters.unit'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.unit
			},
			{
				key: 'city',
				label: t('customFilters.city'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.city
			},
			{
				key: 'county',
				label: t('customFilters.county'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.county
			},
			{
				key: 'state',
				label: t('customFilters.state'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.state
			},
			{
				key: 'zip',
				label: t('customFilters.zip'),
				value: (item: Engagement) => item?.contacts?.[0]?.address?.zip
			},
			{
				key: 'title',
				label: t('requestListColumns.title'),
				value: (item: Engagement) => item?.title
			},
			{
				key: 'description',
				label: t('requestListColumns.description'),
				value: (item: Engagement) => item?.description
			},
			{
				key: 'startDate',
				label: t('requestListColumns.startDate'),
				value: (item: Engagement) => item?.startDate
			},
			{
				key: 'endDate',
				label: t('requestListColumns.endDate'),
				value: (item: Engagement) => item?.endDate
			},
			{
				key: 'status',
				label: t('requestListColumns.status'),
				value: (item: Engagement) => item?.status
			},
			{
				key: 'specialist',
				label: t('requestListColumns.specialist'),
				value: (item: Engagement) => item?.user?.userName
			}
		]
		setCsvFields(
			csvFields
				.filter((field) => !hiddenFields[field.key])
				.map((field) => ({ label: field.label, value: field.value }))
		)
	}, [setCsvFields, getDemographicValue, locale, t, hiddenFields])
}
