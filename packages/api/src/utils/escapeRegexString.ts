/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Escape a string to be used in a regex
 *
 * @param {string} regexString
 * @returns {string}
 * @example
 * escapeRegexString('foo+bar') => 'foo\\+bar'
 */
export function escapeRegexString(regexString: string): string {
	return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
}
