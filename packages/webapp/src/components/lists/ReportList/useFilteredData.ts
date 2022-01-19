/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { fieldFiltersState, headerFiltersState } from '~store'
import { empty, emptyStr } from '~utils/noop'

import { FilterHelper } from './reports/types'
import { IFieldFilter } from './types'

export function useFilteredData(data: unknown[], setFilteredData: (data: unknown[]) => void) {
	const [headerFilters, setHeaderFilters] = useRecoilState(headerFiltersState)
	const [fieldFilters, setFieldFilters] = useRecoilState(fieldFiltersState)

	// const [headerFilters, setHeaderFilters] = useState<IFieldFilter[]>(empty)
	// const [fieldFilters, setFieldFilters] = useState<IFieldFilter[]>(empty)
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
			setHeaderFilters([])
			setFieldFilters([])
		},
		[setHeaderFilters, setFieldFilters]
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
