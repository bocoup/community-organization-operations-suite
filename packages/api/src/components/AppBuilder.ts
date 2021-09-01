/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { ApolloServer, gql } from 'apollo-server-fastify'
import fastifyCors from 'fastify-cors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { Authenticator } from './Authenticator'
import { Configuration } from './Configuration'
import { getLogger } from '~middleware'
import { resolvers, directiveResolvers } from '~resolvers'
import { AppContext, AsyncProvider, BuiltAppContext, RequestContext } from '~types'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { getSchema } from '~utils/getSchema'

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

	private createApolloServer(appContext: BuiltAppContext): void {
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
					return { authHeader: (connectionParams as any).authHeader }
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
			}): Promise<AppContext> => {
				try {
					const getHeaders = (): {
						locale?: string
						authHeader?: string
						userId?: string
						orgId?: string
					} => {
						// Http request headers
						if (ctx.request) {
							const h = ctx.request?.headers ?? {}
							return {
								locale: h.accept_language,
								authHeader: h.authorization,
								userId: h.user_id,
								orgId: h.org_id
							}
						}

						// Websocket connection context headers
						else {
							const c = ctx.connection?.context ?? {}
							return {
								locale: c.accept_language,
								authHeader: c.authHeader,
								userId: c.user_id,
								orgId: c.org_id
							}
						}
					}

					let user = null
					const { authHeader, locale, userId, orgId } = getHeaders()

					if (locale) {
						appContext.components.localization.setLocale(locale)
					}

					if (authHeader) {
						const bearerToken = this.authenticator.extractBearerToken(authHeader)
						user = await this.authenticator.getUser(bearerToken, userId)
					}

					return {
						...appContext,
						requestCtx: {
							identity: user,
							userId: userId || null,
							orgId: orgId || null,
							locale: locale || 'en-US'
						}
					}
				} catch (err) {
					console.log('error establishing context', err)
					throw err
				}
			},
			formatError: (err) => {
				console.log('err in formatError', err)

				// Don't give the specific errors to the client.
				const message = err.message?.toLocaleLowerCase?.() || ''
				if (message.includes('invalid token') || message.includes('not authenticated')) {
					console.log('INVALID TOKEN ERROR')

					return new Error('UNAUTHENTICATED')
				}

				// Otherwise return the original error. The error can also
				// be manipulated in other ways, as long as it's returned.
				return err
			}
		})
	}

	public async start(): Promise<void> {
		await this.#startupPromise
		await this.apolloServer.start()

		const app = fastify()
		app.register(fastifyCors, {
			origin: '*',
			methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
		})
		app.register(this.apolloServer.createHandler())
		this.apolloServer.installSubscriptionHandlers(app.server)
		await app.listen({
			port: this.config.port,
			host: this.config.host
		})
	}
}
