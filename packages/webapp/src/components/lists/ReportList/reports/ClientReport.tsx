/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo, useEffect } from 'react'
import { PaginatedTable } from '~components/ui/PaginatedTable'
import { useClientPageColumns } from './useClientPageColumns'
import styles from '../index.module.scss'
import { CommonReportProps, FilterHelper } from './types'
import { CsvField, IFieldFilter } from '../types'
import { Contact } from '@cbosuite/schema/dist/client-types'
import { useTranslation } from '~hooks/useTranslation'
import { useLocale } from '~hooks/useLocale'
import { useActiveClients } from '../hooks'

export const ClientReport: FC<CommonReportProps> = memo(function ClientReport({
	data,
	filterColumnTextValue,
	filterColumns,
	filterRangedValues,
	getDemographicValue,
	setUnfilteredData,
	setFilteredData,
	setFilterHelper,
	setCsvFields,
	setFieldFilters
}) {
	const columns = useClientPageColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue
	)

	useClientReportData(setUnfilteredData, setFilteredData)
	useClientReportFilters(setFieldFilters)
	useClientReportCsvFields(setCsvFields, getDemographicValue)
	useClientReportFilterHelper(setFilterHelper)

	return (
		<PaginatedTable
			className={styles.reportList}
			list={data}
			itemsPerPage={20}
			columns={columns}
			tableClassName={styles.reportTable}
			headerRowClassName={styles.headerRow}
			bodyRowClassName={styles.bodyRow}
			paginatorContainerClassName={styles.paginatorContainer}
			isLoading={false}
		/>
	)
})

function buildClientFilters(): IFieldFilter[] {
	const headerFilters: IFieldFilter[] = []
	const clientFilters = [
		'name',
		'gender',
		'race',
		'ethnicity',
		'dateOfBirth',
		'city',
		'county',
		'state',
		'zip'
	]
	clientFilters.forEach((filter) => {
		headerFilters.push({
			id: filter,
			name: filter,
			fieldType: 'clientField',
			value: []
		})
	})

	return headerFilters
}

function useClientReportData(
	setUnfilteredData: (data: unknown[]) => void,
	setFilteredData: (data: unknown[]) => void
) {
	const activeClients = useActiveClients()
	setUnfilteredData(activeClients)
	setFilteredData(activeClients)
}

function useClientReportFilters(setFieldFilters: (filters: IFieldFilter[]) => void) {
	useEffect(() => {
		setFieldFilters(buildClientFilters())
	}, [setFieldFilters])
}

function useClientReportCsvFields(
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

function useClientReportFilterHelper(setFilterHelper: (arg: { helper: FilterHelper }) => void) {
	useEffect(() => {
		setFilterHelper({ helper: clientFilterHelper })
	}, [setFilterHelper])
}

function clientFilterHelper(
	filteredContacts: Contact[],
	{ id: filterId, value: filterValue }: IFieldFilter
): Contact[] {
	let tempList = []
	if (filterId === 'dateOfBirth') {
		tempList = filteredContacts.filter((contact) => {
			const [_from, _to] = filterValue as string[]
			const from = _from ? new Date(_from) : undefined
			const to = _to ? new Date(_to) : undefined
			const birthdate = new Date(contact.dateOfBirth)
			birthdate.setHours(0, 0, 0, 0)

			return (!from && !to) ||
				(from && to && birthdate >= from && birthdate <= to) ||
				(!from && birthdate <= to) ||
				(from && !to && birthdate >= from)
				? true
				: false
		})
	} else if (filterId === 'name') {
		const searchStr = filterValue[0]
		if (searchStr === '') {
			return filteredContacts
		}

		tempList = filteredContacts.filter((contact) => {
			const fullName = `${contact.name.first} ${contact.name.last}`
			return fullName.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else if ((['city', 'county', 'state', 'zip'] as string[]).includes(filterId)) {
		const searchStr = filterValue[0]
		if (searchStr === '') {
			return filteredContacts
		}

		tempList = filteredContacts.filter((contact) => {
			const contactProp = contact?.address?.[filterId] || ' '
			return contactProp?.toLowerCase().includes(searchStr.toLowerCase())
		})
	} else {
		tempList = filteredContacts.filter((contact) =>
			(filterValue as any[]).includes(contact.demographics[filterId])
		)
	}
	return tempList
}
