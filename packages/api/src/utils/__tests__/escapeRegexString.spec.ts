/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escapeRegexString } from '../escapeRegexString'

describe('the regex string is escaped of special characters', () => {
	it('should escape all regex special characters', () => {
		const result = escapeRegexString('\\ ^ $ * + ? . ( ) | { } [ ]')
		expect(result).toBe('\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]')
	})

	it('does not effect strings without special characters', () => {
		const result = escapeRegexString('foo bar')
		expect(result).toBe('foo bar')
	})
})
