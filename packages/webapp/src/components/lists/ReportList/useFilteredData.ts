/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { empty, emptyStr } from '~utils/noop'

import { FilterHelper } from './reports/types'
import { IFieldFilter } from './types'

export function useFilteredData(data: unknown[], setFilteredData: (data: unknown[]) => void) {
	const [headerFilters, setHeaderFilters] = useState<IFieldFilter[]>(empty)
	const [fieldFilters, setFieldFilters] = useState<IFieldFilter[]>(empty)
	const [filterHelper, setFilterHelper] = useState<{ helper: FilterHelper } | null>(null)
	const filterUtilities = useFilterUtilities(fieldFilters, setHeaderFilters)
	const [filterUtils] = useState(filterUtilities)

	useEffect(
		function filterData() {
			if (headerFilters.every(isEmptyFilter)) {
				setFilteredData(data)
			} else if (filterHelper != null) {
				let result = data
				headerFilters
					.filter((f) => !isEmptyFilter(f))
					.forEach((filter) => {
						result = filterHelper.helper(result, filter, filterUtils)
					})
				setFilteredData(result)
			}
		},
		[headerFilters, setFilteredData, filterHelper, filterUtils, data]
	)

	const clearFilters = useCallback(
		function clearFilters() {
			setHeaderFilters(empty)
			setFieldFilters(empty)
		},
		[setHeaderFilters]
	)

	return {
		clearFilters,
		fieldFilters,
		setFieldFilters,
		setFilterHelper,
		...filterUtilities
	}
}

function useFilterUtilities(
	filters: IFieldFilter[],
	setReportHeaderFilters: (filters: Array<IFieldFilter>) => void
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	const filterColumns = useCallback(
		(columnId: string, option: IDropdownOption) => {
			const fieldIndex = filters.findIndex((f) => f.id === columnId)
			if (option.selected) {
				const newFilters = [...filters]
				const value = newFilters[fieldIndex]?.value as string[]
				if (!value.includes(option.key as string)) {
					value.push(option.key as string)
				}
				setReportHeaderFilters(newFilters)
			} else {
				const newFilters = [...filters]
				const value = newFilters[fieldIndex]?.value as string[]
				const optionIndex = value.indexOf(option.key as string)
				if (optionIndex > -1) {
					value.splice(optionIndex, 1)
				}
				setReportHeaderFilters(newFilters)
			}
		},
		[filters, setReportHeaderFilters]
	)
	const filterRangedValues = useCallback(
		(key: string, value: string[]) => {
			const newFilters = [...filters]
			newFilters[filters.findIndex((f) => f.id === key)].value = value
			setReportHeaderFilters(newFilters)
		},
		[filters, setReportHeaderFilters]
	)
	const filterColumnTextValue = useCallback(
		(key: string, value: string) => {
			filterRangedValues(key, [value])
		},
		[filterRangedValues]
	)
	const getDemographicValue = useCallback(
		(demographicKey: string, contact: Contact): string => {
			switch (contact?.demographics?.[demographicKey]) {
				case '':
				case 'unknown':
					return ''
				case 'other':
					const otherKey = `${demographicKey}Other`
					return contact?.demographics?.[otherKey]
				default:
					return t(
						`demographics.${demographicKey}.options.${contact?.demographics?.[demographicKey]}`
					)
			}
		},
		[t]
	)

	return { filterColumns, filterColumnTextValue, filterRangedValues, getDemographicValue }
}

function isEmptyFilter({ value }: IFieldFilter) {
	const isEmptyArray = Array.isArray(value) && value.length === 0
	const isEmptyString = typeof value === 'string' && value.trim() === emptyStr
	return isEmptyArray || isEmptyString
}
