/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Helper function to set time to midnight of that day
 * @param timeToFormat
 * @returns
 */
const setToMidnight = (date: Date | number): Date => {
	const _date = new Date(date)
	_date.setHours(0)
	_date.setMinutes(0)
	_date.setSeconds(0)
	_date.setMilliseconds(0)
	return _date
}

/**
 * https://stackoverflow.com/a/14339782
 * @returns {string} Time in "Today", "Yesterday", or date format
 */
export default function getDisplayDate(timeToFormat: string): string {
	const today = setToMidnight(new Date())
	const dateToFormat = new Date(timeToFormat)
	const compDate = setToMidnight(dateToFormat) // month - 1 because January == 0

	const diff = today.getTime() - compDate.getTime() // get the difference between today(at 00:00:00) and the date
	let displayTime = ''

	if (compDate.getTime() === today.getTime()) {
		displayTime = 'Today'
	} else if (diff <= 24 * 60 * 60 * 1000) {
		displayTime = 'Yesterday'
	} else {
		displayTime = compDate.toDateString() // or format it what ever way you want
	}

	// TODO: set localestring to be equal to localized time
	displayTime +=
		' at ' +
		dateToFormat.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		})

	return displayTime
}
