/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RoleType } from '@greenlight/schema/lib/provider-types'
import { Configuration } from './Configuration'
import { User } from '~types'

export class Authenticator {
	#config: Configuration

	public constructor(config: Configuration) {
		this.#config = config
	}

	public extractBearerToken(authHeader: string | null): string | null {
		return authHeader ? authHeader.slice('Bearer '.length) : null
	}

	public async getUser(
		context: any,
		bearerToken: string | null
	): Promise<User | null> {
		const verifyJwt = context.app.jwt.verify(bearerToken)
		if (verifyJwt) {
			const token = await context.collections.userTokens.item({
				token: bearerToken,
			})
			const currTime = new Date().getTime()

			if (token.item && currTime <= token.item.expiration) {
				const user = await context.collections.users.item({
					id: token.item.user,
				})
				return user.item ?? null
			} else if (token.item) {
				await context.collections.userTokens.deleteItem({ id: token.item.id })
			}
		}
		return null
	}

	public async isUserInOrg(user: User, org: string): Promise<boolean> {
		// TBD, make real
		return true
	}

	public async isUserAtSufficientPrivilege(
		user: User,
		org: string,
		role: RoleType
	): Promise<boolean> {
		// make real
		return true
	}
}
