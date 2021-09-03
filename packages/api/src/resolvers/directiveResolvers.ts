/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DirectiveResolverFn, RoleType } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn, mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { AppContext } from '~types'

const directiveResolvers: Record<string, DirectiveResolverFn<unknown, unknown, AppContext>> = {
	auth(next: NextResolverFn, src: any, args: Record<string, any>, context: AppContext) {
		if (!context.requestCtx.identity) {
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
		const { orgId, identity: user } = context.requestCtx
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

export function attachDirectiveResolvers(schema: GraphQLSchema): GraphQLSchema {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const newFieldConfig = { ...fieldConfig }

			const directives = getDirectives(schema, fieldConfig)

			for (const directive of directives) {
				const directiveName = directive.name
				if (directiveResolvers[directiveName]) {
					const resolver = directiveResolvers[directiveName]
					const originalResolver =
						newFieldConfig.resolve != null ? newFieldConfig.resolve : defaultFieldResolver
					const directiveArgs = directive.args
					newFieldConfig.resolve = (source, originalArgs, context, info) => {
						return resolver(
							() =>
								new Promise((resolve, reject) => {
									const result = originalResolver(source, originalArgs, context, info)
									if (result instanceof Error) {
										reject(result)
									}
									resolve(result)
								}),
							source,
							directiveArgs as any,
							context,
							info
						)
					}
				}
			}

			return newFieldConfig
		}
	})
}
