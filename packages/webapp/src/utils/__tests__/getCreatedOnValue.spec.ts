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
})
