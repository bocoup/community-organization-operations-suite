/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortingOrder } from '~types/Sorting'

export type Alphanumeric = string | number

function cleanSortingInput(input: Alphanumeric): string {
	return input?.toString()?.trim()?.toLowerCase() ?? ''
}

export function sortByAlphanumeric(
	a: Alphanumeric,
	b: Alphanumeric,
	order = SortingOrder.ASC
): number {
	const aClean = cleanSortingInput(a)
	const bClean = cleanSortingInput(b)
	return aClean.localeCompare(bClean) * order
}
