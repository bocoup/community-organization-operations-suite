/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

const msToTime = (ms: number) => {
	const seconds = Number((ms / 1000).toFixed(1))
	const minutes = Number((ms / (1000 * 60)).toFixed(1))
	const hours = Number((ms / (1000 * 60 * 60)).toFixed(1))
	const days = (ms / (1000 * 60 * 60 * 24)).toFixed(0)
	if (seconds < 0) return 'Overdue'
	else if (seconds < 60) return seconds + ' Sec'
	else if (minutes < 60) return minutes + ' Min'
	else if (hours < 24) return hours + ' Hrs'
	else return days + ' Days'
}

export const getTimeDuration = (start: Date | string, end: Date | string): string => {
	const eventStartTime = new Date(start)
	const eventEndTime = new Date(end)
	const duration = eventEndTime.valueOf() - eventStartTime.valueOf()
	return msToTime(duration)
}
