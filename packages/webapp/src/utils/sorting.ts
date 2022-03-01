/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortingOrder } from '~types/Sorting'
import type { Alphanumeric, HasDate, Tags } from '~types/Sorting'
import { isEmpty, isNaN } from 'lodash'

const isANumber = (value: Alphanumeric): boolean => !isNaN(new Number(value))

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
	if (isEmpty(a)) return 1
	if (isEmpty(b)) return -1

	// Compare Number
	if (isANumber(a) && isANumber(b)) {
		return (new Number(a) > new Number(b) ? 1 : -1) * order
	}

	// Compare Strings
	const aClean = cleanSortingInput(a)
	const bClean = cleanSortingInput(b)
	return aClean.localeCompare(bClean) * order
}

/** Sort By Date */

export function sortByDate(a: HasDate, b: HasDate, order = SortingOrder.ASC): number {
	// Put the null values after anything else
	if (isEmpty(a)) return 1
	if (isEmpty(b)) return -1

	const aDate = new Date(a.date)
	const bDate = new Date(b.date)
	return (aDate.getTime() > bDate.getTime() ? -1 : 1) * order
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
