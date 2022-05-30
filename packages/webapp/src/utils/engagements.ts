/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'

// Merging methods for Apollo Cache
export function cacheMerge(existing: Engagement[], incoming: Engagement[]) {
	return [...incoming]
}

export function sortByDuration(a: Engagement, b: Engagement) {
	const currDate = new Date()

	const aDate = a?.endDate ? new Date(a.endDate) : currDate
	const bDate = b?.endDate ? new Date(b.endDate) : currDate

	const aDuration = currDate.getTime() - aDate.getTime()
	const bDuration = currDate.getTime() - bDate.getTime()

	return aDuration > bDuration ? -1 : 1
}
