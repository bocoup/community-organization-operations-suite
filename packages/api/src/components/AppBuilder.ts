/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import http from 'http'
import { GraphQLSchema } from 'graphql'
import { createLogger } from '~utils'
import { SubscriptionServerBuilder } from './SubscriptionServerBuilder'
import { ApolloServerBuilder } from './ApolloServerBuilder'
import { FastifyServerBuilder } from './FastifyServerBuilder'
import { createSchema } from '~utils/createSchema'
import { singleton } from 'tsyringe'
import { Configuration } from '~components'

const appLogger = createLogger('app', true)

@singleton()
export class AppBuilder {
	private readonly schema: GraphQLSchema

	public constructor(
		private readonly config: Configuration,
		private readonly subscriptionsBuilder: SubscriptionServerBuilder,
		private readonly apolloBuilder: ApolloServerBuilder,
		private readonly fastifyBuilder: FastifyServerBuilder
	) {
		this.schema = createSchema()
	}

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
			appLogger(`🚀 Server ready at http://${host}:${port}${apollo.graphqlPath}`)
			appLogger(`🚀 Subscriptions ready at ws://${host}:${port}${apollo.graphqlPath}`)
		})
		return server
	}
}
