/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@cbosuite/schema/dist/provider-types'
import { User } from '~types'
import { createLogger, generatePassword, validatePasswordHash } from '~utils'
import { TokenIssuer } from './TokenIssuer'
import { singleton } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { DbRole } from '~db/types'
const logger = createLogger('authenticator')

@singleton()
export class Authenticator {
	public constructor(private userCollection: UserCollection, private tokenIssuer: TokenIssuer) {}
	/**
	 * Middleware to verify the user has a valid token saved from a previous login attempt
	 *
	 * @param bearerToken jwt accessToken
	 * @param userId id of the user trying to access the app
	 * @returns the user or null if the function fails for any reason
	 */
	public async getUser(bearerToken?: string): Promise<User | null> {
		if (!bearerToken) {
			logger(`getUser: no bearer-token present`)
			return null
		}
		const verification = await this.tokenIssuer.verifyAuthToken(bearerToken)
		if (!verification) {
			logger('getUser: jwt verification failure')
			return null
		}
		const userId = (verification as any)?.user_id as string
		if (!userId) {
			logger(`getUser: no userid present`)
			return null
		}
		const userResponse = await this.userCollection.itemById(userId)
		return userResponse.item
	}

	public async authenticateBasic(
		username: string,
		password: string
	): Promise<{
		user: User | null
		token: string | null
	}> {
		const { item: user } = await this.userCollection.findUserWithEmail(username)
		if (user) {
			const isPasswordValid = await validatePasswordHash(password, user.password)
			if (isPasswordValid) {
				const token = await this.tokenIssuer.issueAuthToken(user)
				return { user, token }
			} else {
				logger('authenticate: password invalid')
			}
		} else {
			logger('authenticate: user not found')
		}
		// Return null if user was not found
		return { user: null, token: null }
	}

	public isUserInOrg(user: User | null | undefined, orgId: string): boolean {
		return user?.roles.some((r: DbRole) => r.org_id === orgId) ?? false
	}

	public async resetPassword(user: User): Promise<string> {
		const pass = generatePassword(16)
		await this.userCollection.savePassword(user, pass)
		return pass
	}

	/**
	 * Function to determine if a user has sufficent privilages to access data
	 *
	 * @param {User} user: requesting user
	 * @param {string} orgId: requesting organization id
	 * @param {RoleType} role: minimum role requirement
	 * @returns {boolean} true if a user has sufficent privilages and false if not
	 */
	public isAuthorized(
		user: User | null | undefined,
		orgId: string | null | undefined,
		role: RoleType
	): boolean {
		if (orgId == null) {
			return false
		}
		return (
			user?.roles.some((r: DbRole) => r.org_id === orgId && compareRole(role, r.role_type)) ?? false
		)
	}
}

/**
 * Validate that a user has the minimum target permission
 *
 * @param roleTarget
 * @param userRole
 * @returns {boolean} true if a user has minimum target permission
 */
function compareRole(roleTarget: RoleType, userRole: string): boolean {
	switch (roleTarget) {
		case RoleType.Admin:
			return userRole === RoleType.Admin
		case RoleType.User:
			return userRole === RoleType.Admin || userRole === RoleType.User
		default:
			return false
	}
}
