/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Tag } from '@cbosuite/schema/dist/client-types'

export type Alphanumeric = string | number

export type HasDate = {
	date: string
}

export type Tags = Tag[]

export enum SortingOrder {
	DESC = -1,
	ASC = 1
}

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
