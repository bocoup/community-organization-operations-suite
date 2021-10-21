/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { hashPassword } from '~utils'
import { CollectionBase } from './CollectionBase'
import type { DbUser } from './types'

export class UserCollection extends CollectionBase<DbUser> {
	public findUserWithEmail(email: string) {
		// case insensitive
		return this.item({
			email: new RegExp(['^', email, '$'].join(''), 'i')
		})
	}

	public async savePassword(user: DbUser, password: string) {
		const hash = await hashPassword(password)
		return this.updateItem({ id: user.id }, { $set: { password: hash } })
	}
}
