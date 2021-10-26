/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AuthenticationError } from 'apollo-server-errors'
import { NextResolverFn } from '@graphql-tools/utils'
import { AppContext } from '~types'
import { DirectiveResolverFn } from './types'

export const auth: DirectiveResolverFn = function auth(
	next: NextResolverFn,
	_src: any,
	_directiveArgs: Record<string, any>,
	_resolverArgs: Record<string, any>,
	context: AppContext
) {
	if (!context.requestCtx.identity) {
		throw new AuthenticationError(`Insufficient access: user not authenticated`)
	}
	return next()
}
