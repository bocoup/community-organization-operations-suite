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
	public async saveToken(user: DbUser, token: string): Promise<void> {
		const createTime = new Date()
		const expireTime = new Date()
		expireTime.setHours(expireTime.getHours() + 24)

		await this.revokeOverflowTokens(user.id)
		await this.saveItem({
			user: user.id,
			token,
			expiration: expireTime.getTime(),
			created: createTime.getTime()
		})
	}

	public async findUserTokens(userId: string) {
		return this.items(
			{ offset: 0, limit: this.#maxUserTokens * 2 },
			{ user: userId, expiration: { $gt: new Date().getTime() } }
		)
	}

	public async findExpiredUserTokens(userId: string) {
		return this.items(
			{ offset: 0, limit: this.#maxUserTokens * 2 },
			{ user: userId, expiration: { $lte: new Date().getTime() } }
		)
	}

	public async revoke(tokenId: string) {
		return this.deleteItem({ id: tokenId })
	}

	private async revokeOverflowTokens(userId: string) {
		const existingTokensResponse = await this.items(
			{ offset: 0, limit: this.#maxUserTokens * 2 },
			{ user: userId }
		)

		// Revoke any overflowing tokens
		const existingTokens = existingTokensResponse.items
		existingTokens.sort((a, b) => a.expiration - b.expiration)

		if (existingTokens.length >= this.#maxUserTokens) {
			const numOverflowTokens = existingTokens.length - this.#maxUserTokens - 1
			const tokensToRevoke = existingTokens.slice(numOverflowTokens)
			const revocations = tokensToRevoke.map((t) => this.revoke(t.id))
			logger(`revoking ${revocations.length} overflow tokens`)
			await Promise.all([revocations])
		}
	}
}
