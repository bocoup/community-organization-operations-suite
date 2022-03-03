/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { sortByDate } from '../sorting'

describe('The date sorter', () => {
	it('can sort data with dates', () => {
		const comparisonLess = sortByDate({ date: '2001-01-01' }, { date: '2002-01-01' })
		expect(comparisonLess).toBe(1)
		const comparisonGreater = sortByDate({ date: '2003-01-01' }, { date: '2002-01-01' })
		expect(comparisonGreater).toBe(-1)
	})
})
