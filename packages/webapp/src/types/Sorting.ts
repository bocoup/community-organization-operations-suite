/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { HasDate } from '~utils/sortByDate'
import type { Alphanumeric } from '~utils/sortByAlphanumeric'

export enum SortingOrder {
	DESC = -1,
	ASC = 1
}

export type SortingFunction = (a: SortingInput, b: SortingInput, order: SortingOrder) => number

export type SortingInput = string | number | Alphanumeric | Date | HasDate

export type SortingValue = (x: Record<string, unknown>) => SortingInput

export type ListSorting = {
	key: string
	order: SortingOrder
	sortingValue: SortingValue
	sortingFunction: SortingFunction
}

export type OnHeaderClick = (headerKey: string) => void
