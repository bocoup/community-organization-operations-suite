/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import * as token from '../token'

describe('the token utils', () => {
	it('can extract a token from an auth header', () => {
		const result = token.extractBearerToken('Bearer abc123')
		expect(result).toBe('abc123')
	})
})
