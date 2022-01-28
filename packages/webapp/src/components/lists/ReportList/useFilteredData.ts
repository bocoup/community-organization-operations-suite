/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { headerFiltersState } from '~store'
import { emptyStr } from '~utils/noop'

import { FilterHelper } from './reports/types'
import { IFieldFilter } from './types'

export function useFilteredData(data: unknown[], setFilteredData: (data: unknown[]) => void) {
	const [headerFilters, setHeaderFilters] = useRecoilState(headerFiltersState)
	const [filterHelper, setFilterHelper] = useState<{ helper: FilterHelper } | null>(null)
	const filterUtilities = useFilterUtilities(headerFilters, setHeaderFilters)
	const [filterUtils] = useState(filterUtilities)

	useEffect(
		function filterData() {
			// If filters are empty, return the original data
			if (headerFilters.every(isEmptyFilter)) {
				setFilteredData(data)
			} else if (filterHelper?.helper) {
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

	// Clear all header filters
	const clearFilters = useCallback(
		function clearFilters() {
			setHeaderFilters([])
		},
		[setHeaderFilters]
	)

	// Clear a single header filter
	const clearFilter = useCallback(
		function clearFilters(filterToClear: string) {
			const filterToClearIdx = headerFilters.findIndex((f) => f.id === filterToClear)
			if (filterToClearIdx > -1) {
				const newFilters = [...headerFilters]
				newFilters[filterToClearIdx] = { ...newFilters[filterToClearIdx], value: emptyStr }
				setHeaderFilters(newFilters)
			}
		},
		[setHeaderFilters, headerFilters]
	)

	return {
		clearFilters,
		clearFilter,
		setFilterHelper,
		setHeaderFilters,
		headerFilters,
		...filterUtilities
	}
}

function useFilterUtilities(
	filters: IFieldFilter[],
	setReportHeaderFilters: (filters: Array<IFieldFilter>) => void
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	const filterColumns = (columnId: string, option: IDropdownOption) => {
		const fieldIndex = filters.findIndex((f) => f.id === columnId)
		const filter = filters.find((f) => f.id === columnId)
		const key = option.key as string
		const value = filter?.value ? [...(filter?.value as string[])] : []

		if (option.selected) {
			if (!value.includes(key)) {
				value.push(key)
			}
		} else {
			const optionIndex = value.indexOf(key)
			if (optionIndex > -1) {
				value.splice(optionIndex, 1)
			}
		}

		const newFilters = [...filters]
		newFilters[fieldIndex] = { ...filter, value }
		setReportHeaderFilters(newFilters)
	}

	const filterRangedValues = useCallback(
		(key: string, value: string[]) => {
			// Filters[key].value cannot be directly set
			const newFilters = [...filters]
			const idx = filters.findIndex((f) => f.id === key)
			if (idx > -1) {
				newFilters[idx] = { ...filters[idx], value }
				setReportHeaderFilters(newFilters)
			}
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
