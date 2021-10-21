/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollectionBase } from './CollectionBase'
import type { DbUser } from './types'

export class UserCollection extends CollectionBase<DbUser> {
	public findUserWithEmail(email: string) {
		// case insensitive
		return this.item({
			email: new RegExp(['^', email, '$'].join(''), 'i')
		})
	}
}
