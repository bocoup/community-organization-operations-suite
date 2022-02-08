/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { getLocationQuery } from '../getLocationQuery'

describe('The location query', () => {
	it('can parse a single search parameter', () => {
		const rec = getLocationQuery('test=abc')
		expect(rec['test']).toBe('abc')
		expect(Object.keys(rec)).toHaveLength(1)
	})
	it('can parse multiple search parameters', () => {
		const rec = getLocationQuery('test=abc&second=45&third=last')
		expect(Object.keys(rec)).toHaveLength(3)
		expect(rec['test']).toBe('abc')
		expect(rec['second']).toBe('45')
		expect(rec['third']).toBe('last')
	})
	it('only retains one value for the same key', () => {
		const rec = getLocationQuery('test=abc&test=def&test=zzz')
		expect(Object.keys(rec)).toHaveLength(1)
		expect(rec['test']).toBe('abc')
	})
	it('handles empty strings', () => {
		const rec = getLocationQuery('')
		expect(Object.keys(rec)).toHaveLength(1)
		expect(rec['']).toBeUndefined()
	})
})
