/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { useLocale } from '~hooks/useLocale'
import { useTranslation } from '~hooks/useTranslation'
import { CsvField } from '../../types'

export function useClientReportCsvFields(
	setCsvFields: (fields: Array<CsvField>) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string
) {
	const { t } = useTranslation(['reporting', 'clients'])
	const [locale] = useLocale()

	useEffect(() => {
		setCsvFields([
			{
				label: t('clientList.columns.name'),
				value: (item: Contact) => {
					return `${item?.name?.first} ${item?.name?.last}`
				}
			},
			{
				label: t('demographics.gender.label'),
				value: (item: Contact) => getDemographicValue('gender', item)
			},
			{
				label: t('demographics.race.label'),
				value: (item: Contact) => getDemographicValue('race', item)
			},
			{
				label: t('demographics.ethnicity.label'),
				value: (item: Contact) => getDemographicValue('ethnicity', item)
			},
			{
				label: t('customFilters.birthdate'),
				value: (item: Contact) => new Date(item.dateOfBirth).toLocaleDateString(locale)
			},
			{
				label: t('customFilters.city'),
				value: (item: Contact) => item?.address?.city
			},
			{
				label: t('customFilters.state'),
				value: (item: Contact) => item?.address?.state
			},
			{
				label: t('customFilters.zip'),
				value: (item: Contact) => item?.address?.zip
			}
		])
	}, [setCsvFields, getDemographicValue, locale, t])
}
