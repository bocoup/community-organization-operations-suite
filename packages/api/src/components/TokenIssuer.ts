/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sign, verify, JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { inject, singleton } from 'tsyringe'
import { Configuration } from './Configuration'
import { emptyObj } from '~utils/noop'
import { DbUser } from '~db/types'

export enum TokenPurpose {
	Authentication = 'auth',
	PasswordReset = 'pwreset'
}

export type DecodedToken = JwtPayload & { user_id: string; purpose: TokenPurpose }
export type TokenIssuerConfig = Pick<
	Configuration,
	'jwtSecret' | 'authTokenExpiry' | 'passwordResetTokenExpiry'
>

@singleton()
export class TokenIssuer {
	public constructor(@inject(Configuration) private config: TokenIssuerConfig) {}

	public issueAuthToken(identity: DbUser): Promise<string | null> {
		return this.issueToken(identity.id, TokenPurpose.Authentication, this.config.authTokenExpiry)
	}

	public issuePasswordResetToken(identity: DbUser): Promise<string | null> {
		return this.issueToken(
			identity.id,
			TokenPurpose.PasswordReset,
			this.config.passwordResetTokenExpiry
		)
	}

	protected issueToken(
		userId: string,
		purpose: TokenPurpose,
		expiresIn: string | number,
		extraClaims: Record<string, any> = emptyObj
	): Promise<string | null> {
		return new Promise<string | null>((resolve, reject) =>
			sign(
				{ ...extraClaims, user_id: userId, purpose },
				this.config.jwtSecret,
				{ expiresIn },
				(err, token) => {
					if (err) {
						reject(err)
					} else {
						resolve(token ?? null)
					}
				}
			)
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
			verify(token, this.config.jwtSecret, VERIFY_OPTIONS, (err, decoded) => {
				if (err) {
					resolve(null)
				} else {
					resolve((decoded as any) ?? null)
				}
			})
		})
	}
}

const VERIFY_OPTIONS: VerifyOptions = {}
