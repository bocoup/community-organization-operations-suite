/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserCollection, UserTokenCollection, DbRole } from '../db'
import { RoleType } from '@resolve/schema/lib/provider-types'
import { User } from '~types'
import { Transporter } from 'nodemailer'

const BEARER_PREFIX = 'Bearer '

export class Authenticator {
	#mailer: Transporter
	#userCollection: UserCollection
	#userTokenCollection: UserTokenCollection
	#jwtSecret: string
	#requestOrigin: string

	public constructor(
		userCollection: UserCollection,
		userTokenCollection: UserTokenCollection,
		jwtSecret: string,
		mailer: Transporter
	) {
		this.#userCollection = userCollection
		this.#userTokenCollection = userTokenCollection
		this.#jwtSecret = jwtSecret
		this.#mailer = mailer
		this.#requestOrigin = ''
	}

	/**
	 * Validate that a user has the minimum target permission
	 *
	 * @param roleTarget
	 * @param userRole
	 * @returns {boolean} true if a user has minimum target permission
	 */
	private compareRole(roleTarget: string, userRole: string): boolean {
		switch (roleTarget) {
			case 'ADMIN':
				return userRole === 'ADMIN'
			case 'USER':
				return userRole === 'ADMIN' || userRole === 'USER'
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
			return null
		}

		// Verify the bearerToken is a valid JWT
		const verifyJwt = jwt.verify(bearerToken, this.#jwtSecret)
		if (!verifyJwt) return null

		// Get the dbToken
		const token = await this.#userTokenCollection.item({ user: userId })
		if (!token.item) return null

		// Check the bearerToken matches the encrypted db token
		const tokenIsValid = await bcrypt.compare(bearerToken, token.item.token)
		const tokenIsFresh = new Date().getTime() <= token.item.expiration

		if (tokenIsValid && tokenIsFresh) {
			// Get the user from the user collection
			const user = await this.#userCollection.item({ id: token.item.user })

			return user.item ?? null
		} else if (token.item) {
			// Remove userToken if the user is not found
			await this.#userTokenCollection.deleteItem({ id: token.item.id })
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

		// User exists and the user provided password is valid
		if (result.item && (await bcrypt.compare(password, result.item.password))) {
			const user = result.item

			// Create a token for the user and save it to the token collection
			const token = jwt.sign({}, this.#jwtSecret)
			await this.#userTokenCollection.save(user, await bcrypt.hash(token, 10))

			// Return the user and the created token
			return { user, token }
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

	public setRequestOrigin(origin: string): void {
		this.#requestOrigin = origin
	}

	public getRequestOrigin(): string {
		return this.#requestOrigin
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
}
