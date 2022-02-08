/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getCreatedOnValue } from '../getCreatedOnValue'

describe('The created timestamp parser', () => {
	it('will return invalid date when input an invalid date', () => {
		const parsed = getCreatedOnValue('', true, true)
		expect(parsed).toBe('Invalid Date')
	})
	it('can create a timestamp with a numeric month', () => {
		const parsed = getCreatedOnValue('38700000', true, true)
		expect(parsed).toStrictEqual('1/2/2000, 8:48 PM')
	})
	it('can create a timestamp with a alphabetic month', () => {
		const parsed = getCreatedOnValue('38700000', false, true)
		expect(parsed).toStrictEqual('January 2, 2000, 8:48 PM')
	})
	it('can create a timestamp not showing time', () => {
		const parsed = getCreatedOnValue('38700000', false, false)
		expect(parsed).toStrictEqual('January 2, 2000')
	})
})
