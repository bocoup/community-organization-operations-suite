/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn, DirectiveResolverFn } from 'graphql-tools'
import { AppContext } from '~types'

export const directiveResolvers: Record<string, DirectiveResolverFn> = {
	auth(next: NextResolverFn, src: any, args: Record<string, any>, context: AppContext) {
		if (!context.auth.identity) {
			throw new Error(`Insufficient access: user not authenticated`)
		}
		return next()
	},

	orgAuth(
		next: NextResolverFn,
		src: any,
		args: { requires?: RoleType; [key: string]: any },
		context: AppContext
	) {
		const role = args.requires || RoleType.User
		const { orgId } = context
		const user = context.auth.identity
		const authenticator = context.components.authenticator

		if (!user) {
			throw new Error(`Insufficient access: user not authenticated`)
		}
		if (!orgId) {
			throw new Error('orgAuth is used without an orgId arguments')
		}

		const isInOrg = authenticator.isUserInOrg(user, orgId)
		const isAtSufficientPrivilege = authenticator.isUserAtSufficientPrivilege(user, orgId, role)
		if (!isInOrg) {
			throw new Error(`Insufficient access: user is not a member of org`)
		}
		if (!isAtSufficientPrivilege) {
			throw new Error(`Insufficient access: user does not have role ${role} in org`)
		}

		next()
	}
}
