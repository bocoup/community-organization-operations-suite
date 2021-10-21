/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { NextResolverFn } from '@graphql-tools/utils'
import { AppContext } from '~types'
import { DirectiveResolverFn } from './types'

export const auth: DirectiveResolverFn = function auth(
	next: NextResolverFn,
	src: any,
	directiveArgs: Record<string, any>,
	resolverArgs: Record<string, any>,
	context: AppContext
) {
	if (!context.requestCtx.identity) {
		throw new Error(`Insufficient access: user not authenticated`)
	}
	return next()
}
