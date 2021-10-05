/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserCollection, UserTokenCollection, DbRole, DbUserToken, DbUser } from '~db'
import { RoleType } from '@cbosuite/schema/dist/provider-types'
import { User } from '~types'
import { findMatchingToken, isTokenExpired } from '~utils/tokens'
import { createLogger } from '~utils'
const logger = createLogger('authenticator')

const BEARER_PREFIX = 'Bearer '

export class Authenticator {
	#userCollection: UserCollection
	#userTokenCollection: UserTokenCollection
	#jwtSecret: string
	#maxUserTokens: number

	public constructor(
		userCollection: UserCollection,
		userTokenCollection: UserTokenCollection,
		jwtSecret: string,
		maxUserTokens: number
	) {
		this.#userCollection = userCollection
		this.#userTokenCollection = userTokenCollection
		this.#jwtSecret = jwtSecret
		this.#maxUserTokens = maxUserTokens
	}

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
	public async getUser(bearerToken?: string, userId?: string): Promise<User | null> {
		// Return null if any props are undefined
		if (!bearerToken || !userId) {
			logger('getUser: no bearer token or username present')
			return null
		}

		// Verify the bearerToken is a valid JWT
		const verifyJwt = jwt.verify(bearerToken, this.#jwtSecret)
		if (!verifyJwt) {
			logger('getUser: jwt verification failure')
			return null
		}

		// Find applicable user tokens
		const { tokens, revocations } = await this.findApplicableTokens(userId)
		logger(`matching ${tokens.length} tokens, expiring ${revocations.length} for ${userId}`)
		const validToken = await findMatchingToken(bearerToken, tokens)
		let user: DbUser | null = null
		if (validToken) {
			const userResponse = await this.#userCollection.item({ id: validToken.user })
			user = userResponse.item
		} else {
			logger(`getUser: could not find recorded user token for ${bearerToken}`)
		}
		await Promise.all(revocations)
		return user
	}

	public async authenticateBasic(
		username: string,
		password: string
	): Promise<{
		user: User | null
		token: string | null
	}> {
		const result = await this.#userCollection.item({
			email: new RegExp(['^', username, '$'].join(''), 'i')
		})

		// User exists and the user provided password is valid
		if (result.item) {
			const isPasswordValid = await bcrypt.compare(password, result.item.password)
			if (isPasswordValid) {
				const user = result.item

				// Create a token for the user and save it to the token collection
				const token = jwt.sign({}, this.#jwtSecret)
				const encryptedToken = await bcrypt.hash(token, 10)
				logger(`authenticate: issuing token ${token} to ${user.id}`)
				await this.#userTokenCollection.save(user, encryptedToken)

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

	public isUserInOrg(user: User, orgId: string): boolean {
		return user.roles.some((r: DbRole) => r.org_id === orgId)
	}

	public generatePasswordResetToken() {
		return jwt.sign({}, this.#jwtSecret, { expiresIn: '30m' })
	}

	public verifyPasswordResetToken(token: string): Promise<boolean> {
		return new Promise((resolve) => {
			jwt.verify(token, this.#jwtSecret, (err) => {
				if (err) {
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
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

		await this.#userCollection.updateItem({ id: user.id }, { $set: { password: hash } })

		return pass
	}

	public async setPassword(user: User, password: string): Promise<boolean> {
		const hash = await bcrypt.hash(password, 10)
		await this.#userCollection.updateItem({ id: user.id }, { $set: { password: hash } })

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
	public isUserAtSufficientPrivilege(user: User, orgId: string, role: RoleType): boolean {
		// TODO: change this to account for a single role per org when user roles are refactored
		const userHasSufficientPrivilege = user.roles.some(
			(r: DbRole) => r.org_id === orgId && this.compareRole(role, r.role_type)
		)

		return userHasSufficientPrivilege
	}

	private async findApplicableTokens(userId: string): Promise<{
		tokens: Array<DbUserToken>
		revocations: Array<Promise<unknown>>
	}> {
		const maxUserTokens = this.#maxUserTokens
		const tokensResponse = await this.#userTokenCollection.items(
			{ offset: 0, limit: maxUserTokens * 2 },
			{ user: userId }
		)
		const revoke = (token: DbUserToken) => this.#userTokenCollection.deleteItem({ id: token.id })

		const revocations: Array<Promise<unknown>> = []
		const tokens: Array<DbUserToken> = []

		// Find non-expired tokens
		for (const tokenItem of tokensResponse.items) {
			if (isTokenExpired(tokenItem)) {
				revocations.push(revoke(tokenItem))
			} else {
				tokens.push(tokenItem)
			}
		}

		// Sort by issue date descending
		tokens.sort((a, b) => b.creation - a.creation)
		const recentTokens = tokens.slice(0, maxUserTokens)
		const overflowTokens = tokens.slice(maxUserTokens)
		// revoke any overflow
		overflowTokens.forEach((token) => revocations.push(revoke(token)))

		return { tokens: recentTokens, revocations }
	}
}
