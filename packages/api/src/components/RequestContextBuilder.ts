/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Authenticator } from '~components'
import { RequestContext, User } from '~types'
import { extractBearerToken, createLogger } from '~utils'

const log = createLogger('RequestContextBuilder')

const DEFAULT_LOCALE = 'en-US'

export class RequestContextBuilder {
	public constructor(private readonly authenticator: Authenticator) {}
	public async build({
		authHeader,
		locale
	}: {
		authHeader: string
		locale: string
	}): Promise<RequestContext> {
		let identity: User | null = null
		if (authHeader) {
			const bearerToken = extractBearerToken(authHeader)
			if (!bearerToken) {
				log('no bearer token present')
			}
			identity = await this.authenticator.getUser(bearerToken)
		}

		return {
			identity,
			locale: locale || DEFAULT_LOCALE
		}
	}
}
