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
		async applyPolicy(authDirectiveAST, parent, args, context, info) {
			const requires: RoleType = getOrgAuthRequiresArgument(authDirectiveAST)
			const { orgId } = args
			const user = context.auth.identity
			if (!user) {
				throw new Error('User is not authenticated')
			}
			const [isInOrg, isAtSufficientPrivilege] = await Promise.all([
				authenticator.isUserInOrg(user, orgId),
				authenticator.isUserAtSufficientPrivilege(user, orgId, requires),
			])
			if (!isInOrg) {
				throw new Error(`Insufficient access: user is not a member of org`)
			}
			if (!isAtSufficientPrivilege) {
				throw new Error(
					`Insufficient access: user does not have role ${requires} in org`
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
