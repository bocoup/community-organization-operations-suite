/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import * as Sorting from '~types/Sorting'

type Alphanumeric = string | number

function cleanSortingInput(input: Alphanumeric) {
	return input?.toString()?.trim()?.toLowerCase() ?? 0
}

export function sortByAlphanumeric(
	a: Alphanumeric,
	b: Alphanumeric,
	order = Sorting.Order.ASC
): number {
	const aClean = cleanSortingInput(a)
	const bClean = cleanSortingInput(b)
	return aClean.localeCompare(bClean) * order
}
