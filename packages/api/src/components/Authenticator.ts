/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import bcrypt from 'bcrypt'
import { UserCollection, DbRole } from '~db'
import { RoleType } from '@cbosuite/schema/dist/provider-types'
import { User } from '~types'
import { createLogger } from '~utils'
import { TokenIssuer } from './TokenIssuer'
const logger = createLogger('authenticator')

const BEARER_PREFIX = 'Bearer '

export class Authenticator {
	public constructor(
		private readonly userCollection: UserCollection,
		private readonly tokenIssuer: TokenIssuer
	) {}

	/**
	 * Validate that a user has the minimum target permission
	 *
	 * @param roleTarget
	 * @param userRole
	 * @returns {boolean} true if a user has minimum target permission
	 */
	private compareRole(roleTarget: RoleType, userRole: string): boolean {
		switch (roleTarget) {
			case RoleType.Admin:
				return userRole === RoleType.Admin
			case RoleType.User:
				return userRole === RoleType.Admin || userRole === RoleType.User
			default:
				return false
		}
	}

	/**
	 * Extracts a users jwt accessToken form a client request authorization header
	 *
	 * @param authHeader auth header from a network request
	 * @returns {string} the extracted user accessToken
	 */
	public extractBearerToken(authHeader?: string): string | undefined {
		return authHeader?.slice(BEARER_PREFIX.length)
	}

	/**
	 * Middleware to verify the user has a valid token saved from a previous login attempt
	 *
	 * @param bearerToken jwt accessToken
	 * @param userId id of the user trying to access the app
	 * @returns the user or null if the function fails for any reason
	 */
	public async getUser(bearerToken?: string): Promise<User | null> {
		// Return null if any props are undefined
		logger(`authenticating user with bearer token`, bearerToken)
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

		// User exists and the user provided password is valid
		if (user) {
			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (isPasswordValid) {
				// Create a token for the user and save it to the token collection
				const token = await this.tokenIssuer.issueAuthToken(user)
				logger(`authenticate: issuing token ${token} to ${user.id}`)

				// Return the user and the created token
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

	public generatePassword(length: number, alphaNumericOnly = false): string {
		const _pattern = alphaNumericOnly ? /[a-zA-Z0-9]/ : /[a-zA-Z0-9_\-+.]/
		return [...Array(length)]
			.map(function () {
				let result
				while (true) {
					const randomByte = Math.floor(Math.random() * 256)
					result = String.fromCharCode(randomByte)
					if (_pattern.test(result)) {
						return result
					}
				}
			})
			.join('')
	}

	public async resetPassword(user: User): Promise<string> {
		const pass = this.generatePassword(16)
		const hash = await bcrypt.hash(pass, 10)
		await this.userCollection.updateItem({ id: user.id }, { $set: { password: hash } })
		return pass
	}

	public async setPassword(user: User, password: string): Promise<boolean> {
		const hash = await bcrypt.hash(password, 10)
		await this.userCollection.updateItem({ id: user.id }, { $set: { password: hash } })
		return true
	}

	/**
	 * Function to determine if a user has sufficent privilages to access data
	 *
	 * @param {User} user: requesting user
	 * @param {string} orgId: requesting organization id
	 * @param {RoleType} role: minimum role requirement
	 * @returns {boolean} true if a user has sufficent privilages and false if not
	 */
	public isUserAtSufficientPrivilege(
		user: User | null | undefined,
		orgId: string,
		role: RoleType
	): boolean {
		// TODO: change this to account for a single role per org when user roles are refactored
		return (
			user?.roles.some((r: DbRole) => r.org_id === orgId && this.compareRole(role, r.role_type)) ??
			false
		)
	}
}
