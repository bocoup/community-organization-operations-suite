/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getTimeDuration } from '../getTimeDuration'

describe('Time duration', () => {
	it('sets the duration in seconds when less than a minute', () => {
		const duration = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 08:00:45')
		expect(duration).toStrictEqual({ duration: 45, unit: 'Seconds' })
		const durationLong = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 08:00:59')
		expect(durationLong).toStrictEqual({ duration: 59, unit: 'Seconds' })
	})
	it('sets the duration in minutes when at least one minute and less than an hour', () => {
		const duration = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 08:12:45')
		expect(duration).toStrictEqual({ duration: 12.8, unit: 'Minutes' })
		const durationShort = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 08:01:00')
		expect(durationShort).toStrictEqual({ duration: 1, unit: 'Minutes' })
		const durationLong = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 08:59:55')
		expect(durationLong).toStrictEqual({ duration: 59.9, unit: 'Minutes' })
	})
	it('sets the duration in hours when at least one hour and less than a day', () => {
		const duration = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 18:12:45')
		expect(duration).toStrictEqual({ duration: 10.2, unit: 'Hours' })
		const durationShort = getTimeDuration('2001-01-01 08:00:00', '2001-01-01 09:00:00')
		expect(durationShort).toStrictEqual({ duration: 1, unit: 'Hours' })
		const durationLong = getTimeDuration('2001-01-01 08:00:00', '2001-01-02 07:54:59')
		expect(durationLong).toStrictEqual({ duration: 23.9, unit: 'Hours' })
	})
	it('sets the duration in days when at least one day', () => {
		const duration = getTimeDuration('2001-01-01 08:00:00', '2001-01-02 18:12:45')
		expect(duration).toStrictEqual({ duration: 1, unit: 'Days' })
		const durationShort = getTimeDuration('2001-01-01 08:00:00', '2001-01-15 10:00:00')
		expect(durationShort).toStrictEqual({ duration: 14, unit: 'Days' })
	})
	it('sets the duration to overdue seconds if negative', () => {
		const duration = getTimeDuration('2001-01-01 08:00:45', '2001-01-01 08:00:00')
		expect(duration).toStrictEqual({ duration: -45, unit: 'Overdue' })
	})
})
