/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ForbiddenError } from 'apollo-server'
import { OrgAuthDirectiveArgs } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn } from '@graphql-tools/utils'
import { AppContext } from '~types'

export const orgAuth = async function orgAuth(
	next: NextResolverFn,
	src: any,
	directiveArgs: OrgAuthDirectiveArgs,
	resolverArgs: Record<string, any>,
	ctx: AppContext,
	info: any,
	loc: string
) {
	if (ctx.requestCtx.identity == null) {
		throw new Error(`Insufficient access: user not authenticated`)
	}

	for (const strategy of ctx.components.orgAuthEvaluationStrategies) {
		if (strategy.isApplicable(src, resolverArgs, ctx)) {
			const isAuthorized = await strategy.isAuthorized(src, directiveArgs, resolverArgs, ctx)
			if (isAuthorized) {
				return next()
			} else {
				throw new ForbiddenError(`Insufficient access: user not authorized `)
			}
		}
	}

	throw new Error(`Insufficient access: no strategy found for ${loc}`)
}
