/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'

export function isLocal(engagement: any): boolean {
	return engagement.id.includes('LOCAL')
}

export function sortByDuration(a: Engagement, b: Engagement) {
	const currDate = new Date()

	const aDate = a?.endDate ? new Date(a.endDate) : currDate
	const bDate = b?.endDate ? new Date(b.endDate) : currDate

	const aDuration = currDate.getTime() - aDate.getTime()
	const bDuration = currDate.getTime() - bDate.getTime()

	return aDuration > bDuration ? -1 : 1
}

export function sortByIsLocal(a: Engagement, b: Engagement) {
	const aIsLocal = isLocal(a)
	const bIsLocal = isLocal(b)

	if (!aIsLocal && bIsLocal) return 1
	if (aIsLocal && !bIsLocal) return -1
	return 0
}
