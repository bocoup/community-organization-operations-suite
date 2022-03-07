/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import type http from 'http'
import type { GraphQLSchema } from 'graphql'
import { createLogger } from '~utils'
import { createSchema } from '~utils/createSchema'
import { singleton } from 'tsyringe'
import type { Configuration } from './Configuration'
import type { SubscriptionServerBuilder } from './SubscriptionServerBuilder'
import type { ApolloServerBuilder } from './ApolloServerBuilder'
import type { FastifyServerBuilder } from './FastifyServerBuilder'

const logger = createLogger('app', true)

@singleton()
export class AppBuilder {
	private schema: GraphQLSchema = createSchema()

	public constructor(
		private config: Configuration,
		private subscriptionsBuilder: SubscriptionServerBuilder,
		private apolloBuilder: ApolloServerBuilder,
		private fastifyBuilder: FastifyServerBuilder
	) {}

	public async start(): Promise<http.Server> {
		const server = this.fastifyBuilder!.server
		const schema = this.schema

		// Wire together the subscriptions server and the apollo server
		const apollo = this.apolloBuilder!.build(schema)
		const subscriptions = this.subscriptionsBuilder!.build(schema, server, apollo.graphqlPath)
		this.apolloBuilder!.onDrain(() => subscriptions.close())

		// Wire the apollo server into the HTTP Server
		await apollo.start()
		this.fastifyBuilder?.build(apollo.createHandler())

		// Start the HTTP Server
		const { port, host } = this.config
		server.listen({ port, host }, () => {
			logger(`🚀 Server ready at http://${host}:${port}${apollo.graphqlPath}`)
			logger(`🚀 Subscriptions ready at ws://${host}:${port}${apollo.graphqlPath}`)
		})
		return server
	}
}
