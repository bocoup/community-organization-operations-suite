/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { DbUser } from '~db'

export enum TokenPurpose {
	Authentication = 'auth',
	PasswordReset = 'pwreset'
}

export type DecodedToken = JwtPayload & { user_id: string; purpose: TokenPurpose }

export class TokenIssuer {
	public constructor(
		private readonly jwtSecret: string,
		private readonly authTokenExpiry: string,
		private readonly passwordResetExpiry: string
	) {}

	public issueAuthToken(identity: DbUser): Promise<string | null> {
		return this.issueToken(identity.id, TokenPurpose.Authentication, this.authTokenExpiry)
	}

	public issuePasswordResetToken(identity: DbUser): Promise<string | null> {
		return this.issueToken(identity.id, TokenPurpose.PasswordReset, this.passwordResetExpiry)
	}

	private issueToken(
		userId: string,
		purpose: TokenPurpose,
		expiresIn: string
	): Promise<string | null> {
		return new Promise<string | null>((resolve, reject) =>
			sign({ user_id: userId, purpose }, this.jwtSecret, { expiresIn }, (err, token) => {
				if (err) {
					reject(err)
				} else {
					resolve(token ?? null)
				}
			})
		)
	}

	public async verifyAuthToken(token: string): Promise<DecodedToken | null> {
		const result = await this.verifyToken(token)
		if (result?.purpose !== TokenPurpose.Authentication) {
			return null
		}
		return result as any as DecodedToken
	}

	public async verifyPasswordResetToken(token: string): Promise<DecodedToken | null> {
		const result = await this.verifyToken(token)
		if (result?.purpose !== TokenPurpose.PasswordReset) {
			return null
		}
		return result as any as DecodedToken
	}

	private verifyToken(token: string): Promise<DecodedToken | null> {
		return new Promise<DecodedToken | null>((resolve, _reject) => {
			verify(token, this.jwtSecret, {}, (err, decoded) => {
				if (err) {
					resolve(null)
				} else {
					resolve((decoded as any) ?? null)
				}
			})
		})
	}
}
