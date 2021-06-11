/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const getCreatedOnValue = (
	oid: string,
	isMonthNumeric: boolean,
	showTime: boolean
): string => {
	const oid_timeStamp = oid.substring(0, 8)
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: isMonthNumeric ? 'numeric' : 'long',
		day: 'numeric',
		...(showTime && {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		})
	}
	return new Date(parseInt(oid_timeStamp, 16) * 1000).toLocaleString('en-US', options)
}
