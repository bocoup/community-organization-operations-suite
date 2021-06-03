/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

type HasDate = {
	date: string
}

const sortByDate = (a: HasDate, b: HasDate): number => {
	const aDate = new Date(a.date)
	const bDate = new Date(b.date)
	return bDate.getTime() - aDate.getTime()
}

export default sortByDate
