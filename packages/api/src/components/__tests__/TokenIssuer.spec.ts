/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TokenIssuer, TokenPurpose } from '../TokenIssuer'

class TestTokenIssuer extends TokenIssuer {
	public issueToken(
		userId: string,
		purpose: TokenPurpose,
		expiresIn: string,
		claims: Record<string, any>
	) {
		return super.issueToken(userId, purpose, expiresIn, claims)
	}
}

describe('The TokenIssuer', () => {
	it('handles expiration correctly', async () => {
		const issuer = new TestTokenIssuer('abc123', '24h', '30m')
		let iat = Math.floor(Date.now() / 1000) - 30
		let token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h', { iat })
		let decoded = await issuer.verifyAuthToken(token)
		expect(decoded).not.toBeNull()
		expect(decoded.user_id).toEqual('user_1')
		expect(decoded.purpose).toEqual(TokenPurpose.Authentication)

		iat = Math.floor(Date.now() / 1000) - 60 * 60 * 23
		token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h', { iat })
		decoded = await issuer.verifyAuthToken(token)
		expect(decoded).not.toBeNull()

		iat = Math.floor(Date.now() / 1000) - (60 * 60 * 24 + 1)
		token = await issuer.issueToken('user_1', TokenPurpose.Authentication, '24h', { iat })
		decoded = await issuer.verifyAuthToken(token)
		expect(decoded).toBeNull()
	})
})
