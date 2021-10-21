/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import http from 'http'
import { ApolloServer, gql } from 'apollo-server-fastify'
import { ConnectionContext, SubscriptionServer } from 'subscriptions-transport-ws'
import fastifyCors from 'fastify-cors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Configuration } from './Configuration'
import { getLogger } from '~middleware'
import { resolvers, attachDirectiveResolvers } from '~resolvers'
import { AppContext, AsyncProvider, BuiltAppContext } from '~types'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { getSchema } from '~utils/getSchema'
import { execute, GraphQLSchema, subscribe } from 'graphql'
import WebSocket from 'ws'
import { setup as setupAI } from 'applicationinsights'
import { createLogger } from '~utils'
import { extractBearerToken } from '~utils/token'

const appLogger = createLogger('app', true)
const wsLogger = createLogger('sockets')
const DEFAULT_LOCALE = 'en-US'

export class AppBuilder {
	private readonly startupPromise: Promise<void>
	private _appContext: BuiltAppContext | undefined
	private _subscriptionServer: SubscriptionServer | undefined

	public constructor(contextProvider: AsyncProvider<BuiltAppContext>) {
		this.startupPromise = this.composeApplication(contextProvider)
	}

	private get appContext(): BuiltAppContext {
		if (this._appContext == null) {
			throw new Error('appContext has not been initalized')
		}
		return this._appContext
	}

	private get config(): Configuration {
		return this.appContext.config
	}

	private get subscriptionServer(): SubscriptionServer {
		if (!this._subscriptionServer) {
			throw new Error('subscriptionServer has not been defined')
		}
		return this._subscriptionServer
	}

	private async composeApplication(contextProvider: AsyncProvider<BuiltAppContext>): Promise<void> {
		this._appContext = await contextProvider.get()
		if (this.config.telemetryKey != null) {
			setupAI(this.config.telemetryKey).start()
		}
	}

	private buildRequestContext = async ({
		authHeader,
		locale
	}: {
		authHeader: string
		locale: string
	}) => {
		let user = null
		if (locale) {
			this.appContext.components.localization.setLocale(locale)
		}
		if (authHeader) {
			const bearerToken = extractBearerToken(authHeader)
			if (!bearerToken) {
				appLogger('no bearer token present')
			}
			user = await this.appContext.components.authenticator.getUser(bearerToken)
		}

		return {
			...this.appContext,
			requestCtx: {
				identity: user,
				locale: locale || DEFAULT_LOCALE
			}
		}
	}

	private createSubscriptionServer(
		schema: GraphQLSchema,
		server: http.Server,
		path: string
	): SubscriptionServer {
		const result = SubscriptionServer.create(
			{
				schema,
				execute,
				subscribe,
				onConnect: (
					params: {
						headers: {
							authorization: string
							accept_language: string
							user_id: string
							org_id: string
						}
					},
					_webSocket: WebSocket,
					_context: ConnectionContext
				) => {
					wsLogger(
						`client connected userId=${params.headers.user_id}; org=${
							params.headers.org_id
						}; lang=${params.headers.accept_language}; authHeader.length=${
							params.headers.authorization?.length || 0
						}; `
					)
					return this.buildRequestContext({
						locale: params.headers.accept_language,
						authHeader: params.headers.authorization
					})
				},
				onDisconnect: () => {
					wsLogger('client disconnected')
				}
			},
			{ server, path }
		)
		this._subscriptionServer = result
		return result
	}

	private createApolloServer(schema: GraphQLSchema): ApolloServer {
		return new ApolloServer({
			schema,
			logger: getLogger(this.config),
			introspection: true,
			plugins: [
				{
					serverWillStart: async () => {
						return {
							drainServer: async () => {
								this.subscriptionServer.close()
							}
						}
					}
				}
			],
			context: async (ctx: {
				request?: FastifyRequest
				reply?: FastifyReply<any>
				connection?: any
				payload?: any
			}): Promise<AppContext> => {
				try {
					const h = ctx.request?.headers ?? {}
					const pluck = (s: string): string => (Array.isArray(h[s]) ? h[s]![0] : h[s]) as string
					return this.buildRequestContext({
						locale: pluck('accept_language'),
						authHeader: h.authorization || ''
					})
				} catch (err) {
					appLogger('error establishing context', err)
					throw err
				}
			},
			formatError: (err) => {
				appLogger('err in formatError', err.message, err.stack)

				// Don't give the specific errors to the client.
				const message = err.message?.toLocaleLowerCase?.() || ''
				if (message.includes('invalid token') || message.includes('not authenticated')) {
					appLogger('invalid token', err)
					return new Error('UNAUTHENTICATED')
				}

				// Otherwise return the original error. The error can also
				// be manipulated in other ways, as long as it's returned.
				return err
			}
		})
	}

	public async start(): Promise<http.Server> {
		await this.startupPromise
		const app = fastify()
		const httpServer = app.server
		const schema = createSchema()
		const apolloServer = this.createApolloServer(schema)
		this.createSubscriptionServer(schema, httpServer, apolloServer.graphqlPath)
		await apolloServer.start()
		app.register(apolloServer.createHandler())
		app.register(fastifyCors, {
			origin: '*',
			methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
		})

		const port = this.config.port
		const host = this.config.host
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
