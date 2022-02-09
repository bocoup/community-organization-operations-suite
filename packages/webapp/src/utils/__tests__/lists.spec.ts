/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { moveUp, moveDown } from '../lists'

describe('Items in lists', () => {
	it('can be moved up if they are not first', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveUp(2, basicList)
		expect(updatedList).toStrictEqual([1, 3, 2, 4])
	})
	it('can be moved up if they are last', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveUp(3, basicList)
		expect(updatedList).toStrictEqual([1, 2, 4, 3])
	})
	it('cannot be moved up if they are first', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveUp(0, basicList)
		expect(updatedList).toBe(basicList)
	})
	it('can be moved down if they are not last', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveDown(2, basicList)
		expect(updatedList).toStrictEqual([1, 2, 4, 3])
	})
	it('can be moved down if they are first', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveDown(0, basicList)
		expect(updatedList).toStrictEqual([2, 1, 3, 4])
	})
	it('cannot be moved down if they are last', () => {
		const basicList = [1, 2, 3, 4]
		const updatedList = moveDown(3, basicList)
		expect(updatedList).toBe(basicList)
	})
})
