/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollectionBase } from './CollectionBase'
import type { DbUserToken, DbUser, DbContact } from './types'

export class UserTokenCollection extends CollectionBase<DbUserToken> {
	/**
	 * Saves a user token to the DB via
	 * upsert so an update or insert happens
	 * @param user DBuser who owns this token
	 * @param token String that contains the packed
	 * @returns void
	 */
	public async save(user: DbUser | DbContact, token: string): Promise<void> {
		const createTime = new Date()
		const expireTime = new Date()
		expireTime.setHours(expireTime.getHours() + 24)

		await this.updateItem(
			{ user: user.id },
			{
				$set: {
					token,
					expiration: expireTime.getTime(),
					created: createTime.getTime()
				}
			},
			{ upsert: true }
		)
	}
}
