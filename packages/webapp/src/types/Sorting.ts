/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

enum SortingOrder {
	DESC = -1,
	ASC = 1
}

type SortingFunction = (a: SortingInput, b: SortingInput, order: SortingOrder) => number

type SortingInput = string | number | Date

type SortingValue = (x: Record<string, unknown>) => string

export {
	SortingFunction as Function,
	SortingInput as Input,
	SortingOrder as Order,
	SortingValue as Value
}
