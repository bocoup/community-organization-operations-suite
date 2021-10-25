/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { createLogger } from '~utils'
import { DirectiveResolverFn } from './types'
import { auth } from './auth'
import { orgAuth } from './orgAuth'

const logger = createLogger('directiveResolvers')

export const directiveResolvers: Record<string, DirectiveResolverFn> = {
	auth,
	orgAuth
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
							location || 'unknown location'
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
