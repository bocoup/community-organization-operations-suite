/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function daysAgo(d: number): Date {
	const result = new Date()
	result.setDate(result.getDate() - d)
	return result
}

export function daysLater(d: number): Date {
	const result = new Date()
	result.setDate(result.getDate() + d)
	return result
}

export function sometimeLater(maxDaysLater = 14): Date {
	const numDaysLater = Math.floor(Math.random() * maxDaysLater) + 1 // 1 to N days later
	return daysLater(numDaysLater)
}
