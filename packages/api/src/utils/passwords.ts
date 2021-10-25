/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import bcrypt from 'bcrypt'

export function validatePasswordHash(password: string, hashed: string): Promise<boolean> {
	return bcrypt.compare(password, hashed)
}

export function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 10)
}

export function generatePassword(length: number, alphaNumericOnly = false): string {
	const _pattern = alphaNumericOnly ? /[a-zA-Z0-9]/ : /[a-zA-Z0-9_\-+.]/
	return [...Array(length)]
		.map(function () {
			let result
			while (true) {
				const randomByte = Math.floor(Math.random() * 256)
				result = String.fromCharCode(randomByte)
				if (_pattern.test(result)) {
					return result
				}
			}
		})
		.join('')
}
