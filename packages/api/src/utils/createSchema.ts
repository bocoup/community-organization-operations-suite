/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql } from 'apollo-server-fastify'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers, attachDirectiveResolvers } from '~resolvers'
import { getSchema } from '~utils/getSchema'
import { GraphQLSchema } from 'graphql'

export function createSchema(): GraphQLSchema {
	return attachDirectiveResolvers(
		makeExecutableSchema({
			typeDefs: gql(getSchema()),
			resolvers
		})
	)
}
