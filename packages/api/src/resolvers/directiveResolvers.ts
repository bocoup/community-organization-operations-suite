/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ForbiddenError, UserInputError } from 'apollo-server'
import { Organization, RoleType } from '@cbosuite/schema/dist/provider-types'
import { NextResolverFn, mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { ORGANIZATION_TYPE } from '~dto'
import { AppContext } from '~types'
import { createLogger } from '~utils'

const logger = createLogger('directiveResolvers')

const directiveResolvers: Record<string, any> = {
	auth(
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
	},

	async orgAuth(
		next: NextResolverFn,
		src: any,
		directiveArgs: { requires?: RoleType; [key: string]: any },
		resolverArgs: Record<string, any>,
		context: AppContext,
		info: any,
		loc: string
	) {
		const role = directiveArgs.requires || RoleType.User
		const auth = context.components.authenticator
		const services = context.collections.services

		const { identity } = context.requestCtx
		if (!identity) {
			//
			// Case 0: Not logged in
			//
			logger(`user not authenticated`)
			throw new Error(`Insufficient access: user not authenticated`)
		} else if (src?.__typename === ORGANIZATION_TYPE) {
			//
			// Case 1: user is accessing Organization entity internal data, check if they are in the org
			//
			logger('apply orgAuth to org type')
			const org = src as Organization
			if (auth.isUserAtSufficientPrivilege(identity, org.id, role)) {
				return next()
			} else {
				logger(`user ${identity.email} does not have role ${role} in org ${org.id}`)
				return null
			}
		} else if (resolverArgs['orgId'] != null) {
			//
			// Case 2: User is accessing a query with an orgId query argument
			//
			const orgIdArg = resolverArgs['orgId']
			if (auth.isUserAtSufficientPrivilege(identity, orgIdArg, role)) {
				return next()
			} else {
				throw new ForbiddenError(
					`Insufficient access: user ${identity.email} does not have role ${role} in org ${orgIdArg}`
				)
			}
		} else if (resolverArgs['serviceId']) {
			//
			// Case 3: User is accessing a query with a serviceId argument (e.g. reports data)
			//
			const serviceIdArg = resolverArgs['serviceId']
			const service = await services.itemById(serviceIdArg)
			if (!service.item) {
				throw new UserInputError(`service id ${serviceIdArg} not found`)
			}
			const orgId = service.item.org_id
			if (auth.isUserAtSufficientPrivilege(identity, orgId, role)) {
				return next()
			} else {
				throw new ForbiddenError(
					`Insufficient access: user ${identity.email} does not have role ${role} in org ${orgId}`
				)
			}
		} else {
			const result = await next()
			if (result.orgId != null) {
				//
				// Case 4: Data is returning with an attached orgId
				//
				if (auth.isUserAtSufficientPrivilege(identity, result.orgId, role)) {
					return next()
				} else {
					throw new ForbiddenError(
						`Insufficient access: user ${identity.email} does not have role ${role} in org ${result.orgId}`
					)
				}
			} else {
				//
				// Case 5: No org data available in result, parent, or args. Throw an error
				//
				logger('cannot orgauth', loc)
				throw new Error(`cannot orgAuth at location "${loc}"`)
			}
		}
	}
}

export function attachDirectiveResolvers(schema: GraphQLSchema): GraphQLSchema {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			const newFieldConfig = { ...fieldConfig }
			const directives = getDirectives(schema, fieldConfig)
			const location = fieldConfig?.astNode?.name?.value

			for (const directive of directives) {
				const directiveName = directive.name
				if (directiveResolvers[directiveName]) {
					logger(`attach ${directiveName} to ${location}`)
					const applyDirective = directiveResolvers[directiveName]
					const originalResolver = newFieldConfig.resolve ?? defaultFieldResolver
					newFieldConfig.resolve = (source, args, context, info) => {
						logger(`apply directive ${directive.name} to ${location}`)
						return applyDirective(
							() =>
								new Promise((resolve, reject) => {
									const result = originalResolver(source, args, context, info)
									if (result instanceof Error) {
										reject(result)
									} else {
										resolve(result)
									}
								}),
							source,
							directive.args as any,
							args as any,
							context,
							info,
							location
						)
					}
				} else {
					throw new Error(`could not find directive "${directiveName}"`)
				}
			}

			return newFieldConfig
		}
	})
}
