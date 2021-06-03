/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import bcrypt from 'bcrypt'
import { JWT } from 'fastify-jwt'
import { UserCollection, UserTokenCollection, DbRole } from '../db'
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { User } from '~types'

export class Authenticator {
	#jwt: JWT | undefined
	#nodemailer: any | undefined
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

	public registerNodemailer(nodemailer: any): void {
		this.#nodemailer = nodemailer
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

	private get nodemailer(): any {
		if (this.#nodemailer == null) {
			throw new Error('Nodemailer has not been registired')
		}
		return this.#nodemailer
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

	private generatePassword(length: number): string {
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

	public async resetPassword(user: User): Promise<boolean> {
		const pass = this.generatePassword(16)
		const hash = bcrypt.hashSync(pass, 10)

		const result = await this.#userCollection.updateItem(
			{ id: user.id },
			{ $set: { password: hash } }
		)

		if (!result) {
			return false
		}

		try {
			await this.#nodemailer.sendMail({
				from: 'matt@genui.com', // Default required for dev
				to: 'v-merhart@microsoft.com', // Default required for dev
				subject: user.email,
				text: pass,
			})
		} catch {
			return false
		}

		return true
	}

	public async setPassword(user: User, password: string): Promise<boolean> {
		const hash = bcrypt.hashSync(password, 10)
		const result = await this.#userCollection.updateItem(
			{ id: user.id },
			{ $set: { password: hash } }
		)
		if (!result) {
			return false
		}
		return true
	}

	public async isUserAtSufficientPrivilege(
		user: User,
		org: string,
		role: RoleType
	): Promise<boolean> {
		return user.roles.some((r: DbRole) => r.role_type === role)
	}
}
