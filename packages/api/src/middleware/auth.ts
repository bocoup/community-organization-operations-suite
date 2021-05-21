/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MercuriusAuthOptions } from 'mercurius-auth'
import type { AuthArgs, AppContext } from '../types'

export function authDirectiveConfig(): MercuriusAuthOptions<
	any,
	AuthArgs,
	AppContext
> {
	return {
		authDirective: 'auth',
		async applyPolicy(authDirectiveAST, parent, args, context, info) {
			const user = context.auth.identity
			if (!user) {
				throw new Error(`Insufficient access: user not authenticated`)
			}

			return true
		},
	}
}
