/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Alphanumeric, HasDate, Tags } from '~types/Sorting'
import { isEmpty, isNaN, toNumber } from 'lodash'

export enum SortingOrder {
	DESC = -1,
	ASC = 1
}

export const SortingClassName = 'sorting-button'

const isANumber = (value: Alphanumeric): boolean => !isNaN(toNumber(value))

export function cleanForSearch(input: Alphanumeric): string {
	return input?.toString()?.trim()?.toLowerCase() ?? ''
}

/** Sort By Alphanumeric */

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
		return (toNumber(a) > toNumber(b) ? 1 : -1) * order
	}

	// Compare Strings
	const aClean = cleanForSearch(a)
	const bClean = cleanForSearch(b)
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
