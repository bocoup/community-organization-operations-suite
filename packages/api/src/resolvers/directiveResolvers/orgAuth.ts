/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AuthenticationError, ForbiddenError } from 'apollo-server-errors'
import { OrgAuthDirectiveArgs } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn } from '@graphql-tools/utils'
import { AppContext, OrgAuthEvaluationStrategy } from '~types'
import { createLogger } from '~utils/createLogger'
import { container } from 'tsyringe'
import { OrgAuthStrategyListProvider } from '~components/orgAuthStrategies'

const log = createLogger(`orgAuth`)

export const orgAuth = async function orgAuth(
	next: NextResolverFn,
	src: any,
	directiveArgs: OrgAuthDirectiveArgs,
	resolverArgs: Record<string, any>,
	ctx: AppContext,
	info: any,
	loc: string
) {
	const strategies = container.resolve(OrgAuthStrategyListProvider).get()
	if (ctx.requestCtx.identity == null) {
		throw new AuthenticationError(`Insufficient access: user not authenticated`)
	}

	for (const strategy of strategies) {
		if (isStrategyApplicable(strategy, src, resolverArgs, ctx)) {
			const isAuthorized = await isStrategyAuthorized(
				strategy,
				src,
				directiveArgs,
				resolverArgs,
				ctx
			)
			if (isAuthorized) {
				return next()
			} else {
				throw new ForbiddenError(`Insufficient access: user not authorized`)
			}
		}
	}

	log(`no strategy found for ${loc}`, src, info, loc)
	throw new Error(`Insufficient access: no strategy found for ${loc}`)
}

function isStrategyApplicable(
	strategy: OrgAuthEvaluationStrategy,
	src: any,
	resolverArgs: Record<string, any>,
	ctx: AppContext
) {
	try {
		return strategy.isApplicable(src, resolverArgs, ctx)
	} catch (err) {
		log(`error evaluating orgAuth strategy ${strategy.name}`, err)
		throw err
	}
}

function isStrategyAuthorized(
	strategy: OrgAuthEvaluationStrategy,
	src: any,
	directiveArgs: OrgAuthDirectiveArgs,
	resolverArgs: Record<string, any>,
	ctx: AppContext
) {
	try {
		return strategy.isAuthorized(src, directiveArgs, resolverArgs, ctx)
	} catch (err) {
		log(`strategy ${strategy.name} failed`, err)
		throw err
	}
}
