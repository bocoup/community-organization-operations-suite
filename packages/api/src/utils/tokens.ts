/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { compare } from 'bcrypt'
import { DbUserToken } from '~db/types'

export function isTokenExpired(tokenItem: DbUserToken): boolean {
	return new Date().getTime() >= tokenItem.expiration
}

export function isTokenValid(token: string, tokenItem: DbUserToken): Promise<boolean> {
	return compare(token, tokenItem.token)
}

export async function findMatchingToken(
	token: string,
	tokenList: DbUserToken[]
): Promise<DbUserToken | null> {
	for (const tokenItem of tokenList) {
		const isMatch = await isTokenValid(token, tokenItem)
		if (isMatch) {
			return tokenItem
		}
	}
	return null
}
