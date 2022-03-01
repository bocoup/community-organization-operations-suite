/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortingOrder } from '~types/Sorting'
import type { Alphanumeric, HasDate, Tags } from '~types/Sorting'
import { isNil } from 'lodash'

/** Sort By Alphanumeric */

function cleanSortingInput(input: Alphanumeric): string {
	return input?.toString()?.trim()?.toLowerCase() ?? ''
}

export function sortByAlphanumeric(
	a: Alphanumeric,
	b: Alphanumeric,
	order = SortingOrder.ASC
): number {
	// Put the null values after anything else
	if (isNil(a)) return 1
	if (isNil(b)) return -1

	// Compare strings cleanly
	const aClean = cleanSortingInput(a)
	const bClean = cleanSortingInput(b)
	return aClean.localeCompare(bClean) * order
}

/** Sort By Date */

export function sortByDate(a: HasDate, b: HasDate, order = SortingOrder.ASC): number {
	// Put the null values after anything else
	if (isNil(a)) return 1
	if (isNil(b)) return -1

	const aDate = new Date(a.date)
	const bDate = new Date(b.date)
	return aDate.getTime() > bDate.getTime() ? -1 * order : 1 * order
}

/** Sort by Tags */

function getTagsLabels(tags: Tags): string {
	const labels = tags.map((tag) => tag.label)
	if (labels.length < 1) return null
	return labels.sort().toString()
}

export function sortByTags(a: Tags, b: Tags, order = SortingOrder.ASC): number {
	const aLabels = getTagsLabels(a)
	const bLabels = getTagsLabels(b)
	return sortByAlphanumeric(aLabels, bLabels, order)
}
