/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

type SortingInput = string | number | Date

enum SortingOrder {
	DESC = -1,
	ASC = 1
}

type SortingFunction = (a: SortingInput, b: SortingInput, order: SortingOrder) => number

export { SortingInput as Input, SortingOrder as Order, SortingFunction as Function }
