/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Configuration } from './Configuration'
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { User } from '~types'

export class Authenticator {
	#config: Configuration

	public constructor(config: Configuration) {
		this.#config = config
	}

	public extractBearerToken(authHeader: string | null): string | null {
		return authHeader ? authHeader.slice('Bearer '.length) : null
	}

	public async getUser(bearerToken: string | null): Promise<User | null> {
		// TODO: look up user instance from token
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
