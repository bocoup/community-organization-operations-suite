/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Server } from 'http'
import { execute, subscribe, GraphQLSchema } from 'graphql'
import { ConnectionContext, SubscriptionServer } from 'subscriptions-transport-ws'
import WebSocket from 'ws'
import { BuiltAppContext } from '~types'
import { createLogger } from '~utils'
import { RequestContextBuilder } from './RequestContextBuilder'

const wsLogger = createLogger('sockets')

export class SubscriptionServerBuilder {
	public constructor(
		private readonly requestContextBuilder: RequestContextBuilder,
		private readonly appContext: BuiltAppContext
	) {}

	public build(schema: GraphQLSchema, server: Server, path: string): SubscriptionServer {
		const result = SubscriptionServer.create(
			{
				schema,
				execute,
				subscribe,
				onConnect: async (
					params: {
						headers: {
							authorization: string
							accept_language: string
						}
					},
					_webSocket: WebSocket,
					_context: ConnectionContext
				) => {
					wsLogger(
						`client connected lang=${params.headers.accept_language}; authHeader.length=${
							params.headers.authorization?.length || 0
						};`
					)
					const requestCtx = await this.requestContextBuilder.build({
						locale: params.headers.accept_language,
						authHeader: params.headers.authorization
					})
					return { ...this.appContext, requestCtx }
				},
				onDisconnect: () => {
					wsLogger('client disconnected')
				}
			},
			{ server, path }
		)
		return result
	}
}
