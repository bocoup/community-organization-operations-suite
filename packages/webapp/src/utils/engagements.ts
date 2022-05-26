/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'

export function sortByDuration(a: Engagement, b: Engagement) {
	const currDate = new Date()

	const aDate = a?.endDate ? new Date(a.endDate) : currDate
	const bDate = b?.endDate ? new Date(b.endDate) : currDate

	const aDuration = currDate.getTime() - aDate.getTime()
	const bDuration = currDate.getTime() - bDate.getTime()

	return aDuration > bDuration ? -1 : 1
}

/*
 * Split engagements between the one assigned to the userId and the others.
 *
 * @return [userEngagements[], nonUserEngagements[]]
 */
export function seperateEngagements(
	userId: string,
	engagements?: Engagement[]
): Array<Array<Engagement>> {
	if (!engagements) return [[], []]

	return engagements.reduce(
		(result, engagement) => {
			engagement.user?.id === userId
				? result[0].push(engagement) // userEngagements[]
				: result[1].push(engagement) // nonUserEngagements[]
			return result
		},
		[[], []] as Engagement[][]
	)
}
