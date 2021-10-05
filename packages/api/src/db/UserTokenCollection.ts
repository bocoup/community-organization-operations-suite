/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Collection } from 'mongodb'
import { CollectionBase } from './CollectionBase'
import type { DbUserToken, DbUser } from './types'
import { createLogger } from '~utils'
const logger = createLogger('userTokenCollection')

export class UserTokenCollection extends CollectionBase<DbUserToken> {
	#maxUserTokens: number

	public constructor(collection: Collection, maxUserTokens: number) {
		super(collection)
		this.#maxUserTokens = maxUserTokens
	}
	/**
	 * Saves a user token to the DB via
	 * upsert so an update or insert happens
	 * @param user DBuser who owns this token
	 * @param token String that contains the packed
	 * @returns void
	 */
	public async save(user: DbUser, token: string): Promise<void> {
		const createTime = new Date()
		const expireTime = new Date()
		expireTime.setHours(expireTime.getHours() + 24)

		await this.revokeOverflowTokens(user)
		await this.saveItem({
			user: user.id,
			token,
			expiration: expireTime.getTime(),
			created: createTime.getTime()
		})
	}

	private async revokeOverflowTokens(user: DbUser) {
		const existingTokensResponse = await this.items(
			{ offset: 0, limit: this.#maxUserTokens * 2 },
			{ user: user.id }
		)

		// Revoke any overflowing tokens
		const existingTokens = existingTokensResponse.items
		existingTokens.sort((a, b) => a.expiration - b.expiration)

		if (existingTokens.length >= this.#maxUserTokens) {
			const revoke = (token: DbUserToken) => this.deleteItem({ id: token.id })
			const numOverflowTokens = existingTokens.length - this.#maxUserTokens - 1
			const tokensToRevoke = existingTokens.slice(numOverflowTokens)
			const revocations = tokensToRevoke.map((t) => revoke(t))
			logger(`revoking ${revocations.length} overflow tokens`)
			await Promise.all([revocations])
		}
	}
}
