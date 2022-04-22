/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { TokenIssuer, TokenIssuerConfig, TokenPurpose } from '../TokenIssuer'

class TestTokenIssuer extends TokenIssuer {
	public issueToken(
		userId: string,
		purpose: TokenPurpose,
		expiresIn: string,
		claims?: Record<string, any>
	) {
		return super.issueToken(userId, purpose, expiresIn, claims)
	}
}

// now in epoch time
const now = () => Math.floor(Date.now() / 1000)
const secondsAgo = (ss: number) => now() - ss
const minutesAgo = (mm: number) => secondsAgo(mm * 60)
const hoursAgo = (hh: number) => minutesAgo(hh * 60)
const inSeconds = (ss: number) => now() + ss
const inMinutes = (mm: number) => inSeconds(mm * 60)
const inHours = (hh: number) => inMinutes(hh * 60)

const config: TokenIssuerConfig = {
	jwtSecret: 'abc123',
	authTokenExpiry: '24h',
	passwordResetTokenExpiry: '30m'
}

describe('The TokenIssuer', () => {
	it('handles expiration correctly', async () => {
		const issuer = new TestTokenIssuer(config)
		let token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h')
		let decoded = await issuer.verifyAuthToken(token)
		expect(decoded).not.toBeNull()
		expect(decoded.user_id).toBe('user_1')
		expect(decoded.purpose).toEqual(TokenPurpose.Authentication)

		// on edge of expiry
		let iat = hoursAgo(23)
		token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h', { iat })
		decoded = await issuer.verifyAuthToken(token)
		expect(decoded).not.toBeNull()

		// just past expiry
		iat = hoursAgo(25)
		token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h', { iat })
		await expect(issuer.verifyAuthToken(token)).rejects.toThrow()
	})

	it('handles malformed tokens correctly', async () => {
		const issuer = new TokenIssuer(config)
		await expect(issuer.verifyAuthToken('snthaoeunshtaoesunth [908g3y')).rejects.toThrow()

		await expect(issuer.verifyPasswordResetToken('snthaoeunshtaoesunth [908g3y')).rejects.toThrow()
	})

	it('can issue auth tokens', async () => {
		const issuer = new TokenIssuer(config)
		const token = await issuer.issueAuthToken({ id: 'user_1' })
		const decoded = await issuer.verifyAuthToken(token)
		expect(decoded).not.toBeNull()
		expect(decoded.exp).toBeGreaterThan(inHours(23))
		expect(decoded.exp).toBeLessThan(inHours(25))
	})

	it('can issue password reset tokens', async () => {
		const issuer = new TokenIssuer(config)
		const token = await issuer.issuePasswordResetToken({ id: 'user_1' })
		const decoded = await issuer.verifyPasswordResetToken(token)
		expect(decoded).not.toBeNull()
		expect(decoded.exp).toBeGreaterThan(inMinutes(29))
		expect(decoded.exp).toBeLessThan(inMinutes(31))
	})
})
