/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import http from 'http'
import { AsyncProvider, BuiltAppContext } from '~types'
import { GraphQLSchema } from 'graphql'
import { setup as setupAI } from 'applicationinsights'
import { createLogger } from '~utils'
import { RequestContextBuilder } from './RequestContextBuilder'
import { SubscriptionServerBuilder } from './SubscriptionServerBuilder'
import { ApolloServerBuilder } from './ApolloServerBuilder'
import { FastifyServerBuilder } from './FastifyServerBuilder'
import { createSchema } from '~utils/createSchema'

const appLogger = createLogger('app', true)

export class AppBuilder {
	private readonly startup: Promise<void>
	private readonly schema: GraphQLSchema
	private context: BuiltAppContext | undefined
	private subscriptionsBuilder: SubscriptionServerBuilder | undefined
	private apolloBuilder: ApolloServerBuilder | undefined
	private fastifyBuilder: FastifyServerBuilder | undefined

	public constructor(contextProvider: AsyncProvider<BuiltAppContext>) {
		this.schema = createSchema()
		this.startup = this.compose(contextProvider)
	}

	private async compose(contextProvider: AsyncProvider<BuiltAppContext>): Promise<void> {
		const context = await contextProvider.get()
		const {
			config,
			components: { authenticator }
		} = context

		this.context = context

		if (config.telemetryKey != null) {
			setupAI(config.telemetryKey).start()
		}
		const rcb = new RequestContextBuilder(authenticator)
		this.subscriptionsBuilder = new SubscriptionServerBuilder(rcb, context)
		this.apolloBuilder = new ApolloServerBuilder(config, rcb, context)
		this.fastifyBuilder = new FastifyServerBuilder(config, context)
	}

	public async start(): Promise<http.Server> {
		await this.startup
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
		const { port, host } = this.context!.config
		server.listen({ port, host }, () => {
			appLogger(`🚀 Server ready at http://${host}:${port}${apollo.graphqlPath}`)
			appLogger(`🚀 Subscriptions ready at ws://${host}:${port}${apollo.graphqlPath}`)
		})
		return server
	}
}
