/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum SortingOrder {
	DESC = -1,
	ASC = 1
}

export type SortingFunction = (a: SortingInput, b: SortingInput, order: SortingOrder) => number

export type SortingInput = string | number | Date

export type SortingValue = (x: Record<string, unknown>) => string
