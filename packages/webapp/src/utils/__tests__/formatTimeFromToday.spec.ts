/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { formatTimeFromToday } from '../formatTimeFromToday'

const setHour = (date: Date, hour: number): Date => {
	const _date = new Date(date)
	_date.setHours(hour)
	_date.setMinutes(0)
	_date.setSeconds(0)
	_date.setMilliseconds(0)
	return _date
}

describe('The today time formatter', () => {
	it('will return Today if timestamp is today', () => {
		const testDate = setHour(new Date(), 8)
		const parsed = formatTimeFromToday(testDate)
		expect(parsed).toBe('Today at 8:00 AM')
	})
	it('will return Yesterday if timestamp is yesterday', () => {
		const testDate = setHour(new Date(), 8)
		testDate.setDate(testDate.getDate() - 1)
		const parsed = formatTimeFromToday(testDate)
		expect(parsed).toBe('Yesterday at 8:00 AM')
	})
	it('will return date string if timestamp is not today nor yesterday', () => {
		const testDate = setHour(new Date('2001-02-03 11:00'), 8)
		const parsed = formatTimeFromToday(testDate)
		expect(parsed).toBe('Sat Feb 03 2001 at 8:00 AM')
	})
})
