/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import fs from 'fs'
import { ApolloServer, gql } from 'apollo-server-fastify'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { getLogger } from '~middleware'
import { resolvers, directiveResolvers } from '~resolvers'
import { AppContext, AsyncProvider, BuiltAppContext } from '~types'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from 'fastify-cors'

export class AppBuilder {
	#startupPromise: Promise<void>
	#appContext: BuiltAppContext | undefined
	#apolloServer: ApolloServer | undefined

	public constructor(contextProvider: AsyncProvider<BuiltAppContext>) {
		this.#startupPromise = this.composeApplication(contextProvider)
	}

	private get appContext(): BuiltAppContext {
		if (this.#appContext == null) {
			throw new Error('appContext has not been initalized')
		}
		return this.#appContext
	}

	private get config(): Configuration {
		return this.appContext.config
	}

	private get authenticator(): Authenticator {
		return this.appContext.components.authenticator
	}

	private get apolloServer(): ApolloServer {
		if (!this.#apolloServer) {
			throw new Error('apolloServer is not initialized')
		}
		return this.#apolloServer
	}

	private async composeApplication(contextProvider: AsyncProvider<BuiltAppContext>): Promise<void> {
		this.#appContext = await contextProvider.get()
		this.createApolloServer(this.appContext)
	}

	private createApolloServer(appContext: Partial<AppContext>): void {
		this.#apolloServer = new ApolloServer({
			schema: makeExecutableSchema({
				typeDefs: gql(getSchema()),
				resolvers,
				directiveResolvers
			}),
			playground: this.config.playground,
			logger: getLogger(this.config),
			introspection: true,
			subscriptions: {
				path: '/subscriptions',
				onConnect: (connectionParams, _webSocket, _context) => {
					const authHeader: string = (connectionParams as any).headers.authorization
					console.log('Client connected, auth header length=', authHeader?.length)
					return { authHeader }
				},
				onDisconnect: (_webSocket, _context) => {
					console.log('Client disconnected')
				}
			},
			context: async (ctx: {
				request?: FastifyRequest
				reply?: FastifyReply<any>
				connection?: any
				payload?: any
			}) => {
				try {
					function getAuthHeader(): string | undefined {
						if (ctx.request) {
							// web request headers
							return ctx.request.headers?.authorization
						} else if (ctx.connection) {
							// websocket connection context header
							return ctx.connection.context?.authHeader
						}
					}
					let user = null
					const authHeader = getAuthHeader()
					if (authHeader) {
						const bearerToken = this.authenticator.extractBearerToken(authHeader)
						user = await this.authenticator.getUser(bearerToken)
					}
					return { ...appContext, auth: { identity: user } }
				} catch (err) {
					console.log('error establishing context', err)
					throw err
				}
			}
		})
	}

	public async start(): Promise<void> {
		await this.#startupPromise
		await this.apolloServer.start()

		const app = fastify()
		app.register(cors)
		app.register(this.apolloServer.createHandler())
		this.apolloServer.installSubscriptionHandlers(app.server)
		await app.listen({
			port: this.config.port,
			host: this.config.host
		})
	}
}

function getSchema(): string {
	const result = fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8'
	})
	if (result.length === 0) {
		throw new Error('empty schema detected')
	}
	return result
}
