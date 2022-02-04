/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortingOrder } from '~types/Sorting'

type HasDate = {
	date: string
}

export function sortByDate(a: HasDate, b: HasDate, order = SortingOrder.ASC): number {
	const aDate = new Date(a.date)
	const bDate = new Date(b.date)
	return aDate.getTime() > bDate.getTime() ? -1 * order : 1 * order
}
