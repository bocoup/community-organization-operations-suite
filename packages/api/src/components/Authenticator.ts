/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RoleType } from '@greenlight/schema/lib/provider-types'
import bcrypt from 'bcrypt'
import { JWT } from 'fastify-jwt'
import { UserCollection, UserTokenCollection } from '../db'
import { User } from '~types'

export class Authenticator {
	#jwt: JWT | undefined
	#userCollection: UserCollection
	#userTokenCollection: UserTokenCollection

	public constructor(
		userCollection: UserCollection,
		userTokenCollection: UserTokenCollection
	) {
		this.#userCollection = userCollection
		this.#userTokenCollection = userTokenCollection
	}

	public registerJwt(jwt: JWT): void {
		this.#jwt = jwt
	}

	public extractBearerToken(authHeader: string | null): string | null {
		return authHeader ? authHeader.slice('Bearer '.length) : null
	}

	private get jwt(): JWT {
		if (this.#jwt == null) {
			throw new Error('JWT has not been registired')
		}
		return this.#jwt
	}

	public async getUser(bearerToken: string | null): Promise<User | null> {
		if (bearerToken == null) {
			return null
		}
		const verifyJwt = this.jwt.verify(bearerToken)
		if (verifyJwt) {
			const token = await this.#userTokenCollection.item({
				token: bearerToken,
			})
			const currTime = new Date().getTime()

			if (token.item && currTime <= token.item.expiration) {
				const user = await this.#userCollection.item({
					id: token.item.user,
				})
				return user.item ?? null
			} else if (token.item) {
				await this.#userTokenCollection.deleteItem({ id: token.item.id })
			}
		}
		return null
	}

	public async authenticateBasic(
		username: string,
		password: string
	): Promise<{
		user: User | null
		token: string | null
	}> {
		const result = await this.#userCollection.item({ email: username })

		if (result.item && bcrypt.compareSync(password, result.item.password)) {
			const user = result.item
			const token = this.jwt.sign({})
			await this.#userTokenCollection.save(user, token)
			return { user, token }
		}
		return { user: null, token: null }
	}

	public async isUserInOrg(user: User, org: string): Promise<boolean> {
		// TBD, make real
		return true
	}

	// public async

	public async isUserAtSufficientPrivilege(
		user: User,
		org: string,
		role: RoleType
	): Promise<boolean> {
		// make real
		return true
	}
}
