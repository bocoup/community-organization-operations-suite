/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { fieldFiltersState } from '~store'
import { emptyStr } from '~utils/noop'

import type { FilterHelper } from './reports/types'
import type { IFieldFilter } from './types'

export function useFilteredData(data: unknown[], setFilteredData: (data: unknown[]) => void) {
	const [fieldFilters, setFieldFilters] = useRecoilState(fieldFiltersState)
	const [filterHelper, setFilterHelper] = useState<{ helper: FilterHelper } | null>(null)
	const filterUtilities = useFilterUtilities(fieldFilters, setFieldFilters)
	const [filterUtils] = useState(filterUtilities)

	useEffect(
		function filterData() {
			// If filters are empty, return the original data
			if (fieldFilters.every(isEmptyFilter)) {
				setFilteredData(data)
			} else if (filterHelper?.helper) {
				let result = data

				fieldFilters
					.filter((f) => !isEmptyFilter(f))
					.forEach((filter) => {
						result = filterHelper.helper(result, filter, filterUtils)
					})
				setFilteredData(result)
			}
		},
		[fieldFilters, setFilteredData, filterHelper, filterUtils, data]
	)

	// Clear all header filters
	const clearFilters = useCallback(
		function clearFilters() {
			setFieldFilters([])
		},
		[setFieldFilters]
	)

	// Clear a single header filter
	const clearFilter = useCallback(
		function clearFilters(filterToClear: string) {
			const filterToClearIdx = fieldFilters.findIndex((f) => f.id === filterToClear)
			if (filterToClearIdx > -1) {
				const newFilters = [...fieldFilters]
				newFilters[filterToClearIdx] = { ...newFilters[filterToClearIdx], value: emptyStr }
				setFieldFilters(newFilters)
			}
		},
		[setFieldFilters, fieldFilters]
	)

	return {
		clearFilters,
		clearFilter,
		setFilterHelper,
		setFieldFilters,
		fieldFilters,
		...filterUtilities
	}
}

function useFilterUtilities(
	filters: IFieldFilter[],
	setReportHeaderFilters: (filters: Array<IFieldFilter>) => void
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	const filterColumns = (columnId: string, value: string[]) => {
		const fieldIndex = filters.findIndex((f) => f.id === columnId)
		const oldFilter = filters[fieldIndex]
		const newFilters = [...filters]
		newFilters[fieldIndex] = { ...oldFilter, value }
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
