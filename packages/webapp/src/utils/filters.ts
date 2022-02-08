/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function applyStringFilterValue<T>(
	search: string,
	items: T[],
	getApplyTo: (item: T) => string | null | undefined
): T[] {
	if (!search || search.trim() === '') {
		return items
	}

	return items.filter((item) => {
		const applyTo = getApplyTo(item) ?? ''
		return applyTo.toLowerCase().includes(search.toLowerCase())
	})
}

export function applyMultipleChoiceFilterValues<T>(
	filters: string[],
	items: T[],
	getApplyTo: (item: T) => string[] | string | null | undefined
): T[] {
	if (!filters?.length) {
		return items
	} else {
		const filteredItems = items.filter((item) => {
			const applyTo = getApplyTo(item) ?? ''
			if (applyTo instanceof Array) {
				return filters.some((s) => applyTo.some((t) => t.toLowerCase() === s.toLowerCase()))
			} else {
				return filters.some((s) => applyTo.toLowerCase() === s.toLowerCase())
			}
		})

		return filteredItems
	}
}

export function applyMultiStringFilterValue<T>(
	search: string,
	items: T[],
	getApplyTo: (item: T) => string[] | null | undefined
): T[] {
	if (!search || search.trim() === '') {
		return items
	}

	return items.filter((item) => {
		const applyTo = getApplyTo(item) ?? []
		for (const value of applyTo) {
			if (value.toLowerCase().includes(search.toLowerCase())) {
				return true
			}
		}
		return false
	})
}

export function applyDateFilter<T>(
	start: string | Date | null | undefined,
	end: string | Date | null | undefined,
	items: T[],
	getApplyTo: (item: T) => string | Date | null | undefined
): T[] {
	//TODO:	date handling does not properly account for timezones & localization
	//		if the start or end date match an item's date, it will not match due to
	//		how the date is captured and the timezone is applied
	if (!start && !end) {
		return items
	}

	const startDate = start ? new Date(start) : undefined
	const endDate = end ? new Date(end) : undefined

	return items.filter((t) => {
		const val = getApplyTo(t)
		if (!val) return false

		const dateToCompare = val ? new Date(val) : undefined
		dateToCompare?.setHours(0, 0, 0, 0)

		let result = true
		result = result && (!startDate || dateToCompare >= startDate)
		result = result && (!endDate || dateToCompare <= endDate)
		return result
	})
}

export function applyNumberFilter<T>(
	start: number | null | undefined,
	end: number | null | undefined,
	items: T[],
	getApplyTo: (item: T) => number | null | undefined
): T[] {
	const _start = parseFloat(start?.toString())
	const _end = parseFloat(end?.toString())
	if (!_start && !_end) {
		return items
	}

	return items.filter((t) => {
		const val = getApplyTo(t)
		if (val == null) return false

		//TODO:	the else statement should not be needed due to already
		//		checking for !start & !end at the start of the functions.
		//TODO: for simplicity, the style if this function and applyDateFilter
		//		should probably match.
		if (_start && _end) {
			return val >= _start && val <= _end
		} else if (_start) {
			return val >= _start
		} else if (_end) {
			return val <= _end
		} else {
			return true
		}
	})
}

export function applyOptionsFilter<T>(
	options: string[],
	items: T[],
	getApplyTo: (item: any) => string[] | null | undefined
): T[] {
	//TODO: this is basically a simpler applyMultipleChoiceFilterValues
	//		missing the case insensitive nature of it. They should quite
	//		possibly be combined.
	//TODO: if an empty filter is specified, this should probably return the whole list.
	return items.filter((item) => {
		const values = getApplyTo(item)
		return values && values.some((value) => options.includes(value))
	})
}
