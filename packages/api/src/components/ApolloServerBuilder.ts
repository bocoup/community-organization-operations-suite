/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ApolloServer } from 'apollo-server-fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import { GraphQLSchema } from 'graphql'
import { Configuration } from '~components'
import { getLogger } from '~middleware'
import { AppContext, BuiltAppContext } from '~types'
import { createLogger } from '~utils'
import { noop } from '~utils/noop'
import { RequestContextBuilder } from './RequestContextBuilder'

const log = createLogger('app', true)

export type OnDrainHandler = () => void

export class ApolloServerBuilder {
	private onDrainHandler: OnDrainHandler = noop

	public constructor(
		private readonly config: Configuration,
		private readonly requestContextBuilder: RequestContextBuilder,
		private readonly appContext: BuiltAppContext
	) {}

	public build(schema: GraphQLSchema): ApolloServer {
		const { debug, introspection } = this.config

		return new ApolloServer({
			schema,
			debug,
			logger: getLogger(this.config),
			introspection,
			plugins: [
				{
					serverWillStart: async () => ({
						drainServer: async () => {
							this.onDrainHandler()
						}
					})
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
					const requestCtx = await this.requestContextBuilder.build({
						locale: pluck('accept_language'),
						authHeader: h.authorization || ''
					})
					return { ...this.appContext, requestCtx }
				} catch (err) {
					log('error establishing context', err)
					throw err
				}
			},
			formatError: (err) => {
				log('err in formatError', err.message, err.stack)
				return err
			}
		})
	}

	public onDrain(handler: OnDrainHandler): void {
		this.onDrainHandler = handler
	}
}
