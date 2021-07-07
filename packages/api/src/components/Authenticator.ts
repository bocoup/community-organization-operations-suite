/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserCollection, UserTokenCollection, DbRole } from '../db'
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { User } from '~types'
import { Transporter } from 'nodemailer'

const BEARER_PREFIX = 'Bearer '

export class Authenticator {
	#mailer: Transporter
	#userCollection: UserCollection
	#userTokenCollection: UserTokenCollection
	#jwtSecret: string

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
	}

	public extractBearerToken(authHeader: string | null): string | null {
		return authHeader ? authHeader.slice(BEARER_PREFIX.length) : null
	}

	public async getUser(bearerToken: string | null): Promise<User | null> {
		if (bearerToken == null) {
			return null
		}
		const verifyJwt = jwt.verify(bearerToken, this.#jwtSecret)
		if (verifyJwt) {
			const token = await this.#userTokenCollection.item({
				token: bearerToken
			})
			const currTime = new Date().getTime()

			if (token.item && currTime <= token.item.expiration) {
				const user = await this.#userCollection.item({
					id: token.item.user
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
			const token = jwt.sign({}, this.#jwtSecret)
			await this.#userTokenCollection.save(user, token)
			return { user, token }
		}
		return { user: null, token: null }
	}

	public isUserInOrg(user: User, org: string): boolean {
		// TBD, make real
		return true
	}

	public generatePassword(length: number): string {
		const _pattern = /[a-zA-Z0-9_\-+.]/
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
		const hash = bcrypt.hashSync(pass, 10)

		await this.#userCollection.updateItem({ id: user.id }, { $set: { password: hash } })

		return pass
	}

	public async setPassword(user: User, password: string): Promise<boolean> {
		const hash = bcrypt.hashSync(password, 10)
		await this.#userCollection.updateItem({ id: user.id }, { $set: { password: hash } })

		return true
	}

	public isUserAtSufficientPrivilege(user: User, org: string, role: RoleType): boolean {
		// TODO: Implement user role hierarchy
		// console.log(
		// 	'isUserAtSufficientPrivilege function ',
		// 	'user',
		// 	user,
		// 	'org',
		// 	org,
		// 	'role',
		// 	role
		// )
		// // Get the user org
		// // Get the role for the user for the org provided
		// const compareRole = (roleTarget: string, userRole: string) => {
		// 	console.log(
		// 		'compare role ',
		// 		'roleTarget',
		// 		roleTarget,
		// 		'userRole',
		// 		userRole
		// 	)

		// 	switch (roleTarget) {
		// 		case 'ADMIN':
		// 			return userRole === 'ADMIN'
		// 		case 'USER':
		// 			return userRole === 'ADMIN' || userRole === 'USER'
		// 	}
		// }

		// return user.roles.some(
		// 	(r: DbRole) => r.org_id === org && compareRole(role, r.role_type)
		// )
		return user.roles.some((r: DbRole) => r.role_type === role)
	}
}
