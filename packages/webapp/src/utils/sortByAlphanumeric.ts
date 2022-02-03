/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

type Alphanumeric = string | number
export enum SortingOrder {
	DESC = -1,
	ASC = 1
}

function cleanSortingInput(input: Alphanumeric) {
	return input?.toString()?.trim()?.toLowerCase() ?? 0
}

export function sortByAlphanumeric(
	a: Alphanumeric,
	b: Alphanumeric,
	order = SortingOrder.ASC
): number {
	const aClean = cleanSortingInput(a)
	const bClean = cleanSortingInput(b)

	if (aClean < bClean) return -1 * order
	if (aClean > bClean) return 1 * order
	return 0

	// return aClean.localeCompare(bClean) * order
}
