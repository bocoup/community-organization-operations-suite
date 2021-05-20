/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DirectiveNode } from 'graphql'
import { MercuriusAuthOptions } from 'mercurius-auth'
import type { AuthArgs, AppContext } from '../types'
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { Authenticator } from '~components/Authenticator'

export function orgAuthDirectiveConfig(
	authenticator: Authenticator
): MercuriusAuthOptions<any, AuthArgs, AppContext> {
	return {
		authDirective: 'orgAuth',
		async authContext(context) {
			const authHeader: string = context.reply.request.headers['authorization']

			if (authHeader) {
				const bearerToken = authenticator.extractBearerToken(authHeader)
				if (bearerToken) {
					const user = await authenticator.getUser(context, bearerToken)
					if (user) {
						return { identity: user }
					}
				}
			} else if (context.reply.request.body.query) {
				const query = context.reply.request.body.query.replace(/[\r\n\s]+/g, '')
				if (query.startsWith('mutation{authenticate(')) {
					return { identity: null }
				}
			}

			throw new Error(`Insufficient access: user not authenticated`)
		},
		async applyPolicy(authDirectiveAST, parent, args, context, info) {
			const requires: RoleType = getOrgAuthRequiresArgument(authDirectiveAST)
			const { orgId } = args
			const user = context.auth.identity
			const [isInOrg, isAtSufficientPrivilege] = await Promise.all([
				authenticator.isUserInOrg(user, orgId),
				authenticator.isUserAtSufficientPrivilege(
					authenticator,
					orgId,
					requires
				),
			])
			if (!isInOrg) {
				throw new Error(
					`Insufficient access: user ${user} is not a member of ${orgId}`
				)
			}
			if (!isAtSufficientPrivilege) {
				throw new Error(
					`Insufficient access: user ${user} does not have role ${requires} in org ${orgId}`
				)
			}

			return true
		},
	}
}

function getOrgAuthRequiresArgument(ast: DirectiveNode): RoleType {
	if (ast.arguments) {
		if (ast.arguments.length > 0) {
			const argument = (ast.arguments[0].value as any).value as RoleType
			return argument
		}
	}
	return 'USER' as RoleType
}
