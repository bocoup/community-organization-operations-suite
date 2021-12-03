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

export function applyDateFilter<T>(
	start: Date | null | undefined,
	end: Date | null | undefined,
	items: T[],
	getApplyTo: (item: T) => Date | null | undefined
): T[] {
	if (!start && !end) {
		return items
	}
	return items.filter((t) => {
		const val = getApplyTo(t)
		if (!val) return false
		let result = true
		result = result && (!start || val >= start)
		result = result && (!end || val <= end)
		return result
	})
}

export function applyNumberFilter<T>(
	start: number | null | undefined,
	end: number | null | undefined,
	items: T[],
	getApplyTo: (item: T) => number | null | undefined
): T[] {
	if (!start && !end) {
		return items
	}
	return items.filter((t) => {
		const val = getApplyTo(t)
		if (val == null) return true
		let result = true
		result = result && (!start || val >= start)
		result = result && (!end || val <= end)
		return result
	})
}

export function applyOptionsFilter<T>(
	options: string[],
	items: T[],
	getApplyTo: (item: any) => string[] | null | undefined
): T[] {
	return items.filter((item) => {
		const values = getApplyTo(item)
		return values && values.some((value) => options.includes(value))
	})
}
