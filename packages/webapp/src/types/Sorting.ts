/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Tag } from '@cbosuite/schema/dist/client-types'
import type { SortingOrder } from '~utils/sorting'

export type Alphanumeric = string | number

export type HasDate = {
	date: string
}

export type Tags = Tag[]

export type SortingInput = string | number | Alphanumeric | Date | HasDate | Tags

export type SortingFunction = (a: SortingInput, b: SortingInput, order: SortingOrder) => number

export type SortingValue = (x: Record<string, unknown>) => SortingInput

export type ListSorting = {
	key: string
	order: SortingOrder
	sortingValue: SortingValue
	sortingFunction: SortingFunction
}

export type OnHeaderClick = (headerKey: string) => void
