/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { useLocale } from '~hooks/useLocale'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { CsvField } from '../../types'

export function useClientReportCsvFields(
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients)
	const [locale] = useLocale()
	useEffect(() => {
		const csvFields = [
			{
				key: 'name',
				label: t('clientList.columns.name'),
				value: (item: Contact) => {
					return `${item?.name?.first} ${item?.name?.last}`
				}
			},
			{
				key: 'gender',
				label: t('demographics.gender.label'),
				value: (item: Contact) => getDemographicValue('gender', item)
			},
			{
				key: 'dateOfBirth',
				label: t('customFilters.birthdate'),
				value: (item: Contact) => new Date(item.dateOfBirth).toLocaleDateString(locale)
			},
			{
				key: 'race',
				label: t('demographics.race.label'),
				value: (item: Contact) => getDemographicValue('race', item)
			},
			{
				key: 'ethnicity',
				label: t('demographics.ethnicity.label'),
				value: (item: Contact) => getDemographicValue('ethnicity', item)
			},
			{
				key: 'preferredLanguage',
				label: t('demographics.preferredLanguage.label'),
				value: (item: Contact) => getDemographicValue('preferredLanguage', item)
			},
			{
				key: 'preferredContactMethod',
				label: t('demographics.preferredContactMethod.label'),
				value: (item: Contact) => getDemographicValue('preferredContactMethod', item)
			},
			{
				key: 'preferredContactTime',
				label: t('demographics.preferredContactTime.label'),
				value: (item: Contact) => getDemographicValue('preferredContactTime', item)
			},
			{
				key: 'city',
				label: t('customFilters.city'),
				value: (item: Contact) => item?.address?.city
			},
			{
				key: 'county',
				label: t('customFilters.county'),
				value: (item: Contact) => item?.address?.county
			},
			{
				key: 'state',
				label: t('customFilters.state'),
				value: (item: Contact) => item?.address?.state
			},
			{
				key: 'zip',
				label: t('customFilters.zip'),
				value: (item: Contact) => item?.address?.zip
			}
		]
		setCsvFields(
			csvFields
				.filter((field) => !hiddenFields[field.key])
				.map((field) => ({ label: field.label, value: field.value }))
		)
	}, [setCsvFields, getDemographicValue, locale, t, hiddenFields])
}
