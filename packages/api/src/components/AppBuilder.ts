/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import http from 'http'
import { gql } from 'apollo-server-fastify'
import fastifyCors from 'fastify-cors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Configuration } from './Configuration'
import { resolvers, attachDirectiveResolvers } from '~resolvers'
import { AsyncProvider, BuiltAppContext } from '~types'
import fastify from 'fastify'
import { getSchema } from '~utils/getSchema'
import { GraphQLSchema } from 'graphql'
import { setup as setupAI } from 'applicationinsights'
import { createLogger } from '~utils'
import { RequestContextBuilder } from './RequestContextBuilder'
import { SubscriptionServerBuilder } from './SubscriptionServerBuilder'
import { ApolloServerBuilder } from './ApolloServerBuilder'
import { version } from '../../.version.json'

const appLogger = createLogger('app', true)

export class AppBuilder {
	private readonly startupPromise: Promise<void>
	private appContext: BuiltAppContext | undefined
	private subscriptionServerBuilder: SubscriptionServerBuilder | undefined
	private requestContextBuilder: RequestContextBuilder | undefined
	private apolloServerBuilder: ApolloServerBuilder | undefined

	public constructor(contextProvider: AsyncProvider<BuiltAppContext>) {
		this.startupPromise = this.composeApplication(contextProvider)
	}

	private get config(): Configuration {
		return this.appContext!.config
	}

	private async composeApplication(contextProvider: AsyncProvider<BuiltAppContext>): Promise<void> {
		this.appContext = await contextProvider.get()
		if (this.config.telemetryKey != null) {
			setupAI(this.config.telemetryKey).start()
		}
		this.requestContextBuilder = new RequestContextBuilder(this.appContext.components.authenticator)
		this.subscriptionServerBuilder = new SubscriptionServerBuilder(
			this.requestContextBuilder,
			this.appContext
		)
		this.apolloServerBuilder = new ApolloServerBuilder(
			this.config,
			this.requestContextBuilder,
			this.appContext
		)
	}

	public async start(): Promise<http.Server> {
		await this.startupPromise
		const app = fastify()
		const schema = createSchema()

		const httpServer = app.server
		const apolloServer = this.apolloServerBuilder!.build(schema)
		const subscriptionServer = this.subscriptionServerBuilder!.build(
			schema,
			httpServer,
			apolloServer.graphqlPath
		)
		this.apolloServerBuilder!.onDrain(() => subscriptionServer.close())
		await apolloServer.start()
		app.register(apolloServer.createHandler())
		app.register(fastifyCors, FASTIFY_CORS_OPTIONS)

		const { port, host } = this.config
		app.get('/version', (req, res) => {
			res.send({ version })
		})
		app.ready()
		httpServer.listen({ port, host }, () => {
			appLogger(`🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`)
			appLogger(`🚀 Subscriptions ready at ws://${host}:${port}${apolloServer.graphqlPath}`)
		})
		return httpServer
	}
}

function createSchema(): GraphQLSchema {
	return attachDirectiveResolvers(
		makeExecutableSchema({
			typeDefs: gql(getSchema()),
			resolvers
		})
	)
}

const FASTIFY_CORS_OPTIONS = {
	origin: '*',
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}
