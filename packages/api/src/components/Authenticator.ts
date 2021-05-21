/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RoleType } from '@greenlight/schema/lib/provider-types'
import { Configuration } from './Configuration'
import { UserCollection, UserTokenCollection } from '../db'
import { User } from '~types'
import bcrypt from 'bcrypt'

export class Authenticator {
	#config: Configuration
	#jwt: any
	#userCollection: any
	#userTokenCollection: any

	public constructor(config: Configuration) {
		this.#config = config
	}

	public registerContext(app: any, appContext: any) {
		this.#jwt = app.jwt
		this.#userCollection = appContext.collections.users
		this.#userTokenCollection = appContext.collections.userTokens
	}

	public extractBearerToken(authHeader: string | null): string | null {
		return authHeader ? authHeader.slice('Bearer '.length) : null
	}

	public async getUser(bearerToken: string | null): Promise<User | null> {
		const verifyJwt = this.#jwt.verify(bearerToken)
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

	public async authenticateBasic(username: string, password: string) {
		const result = await this.#userCollection.item({ email: username })

		if (result.item && bcrypt.compareSync(password, result.item.password)) {
			const user = result.item
			const token = this.#jwt.sign({})
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
