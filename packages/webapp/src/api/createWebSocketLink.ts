/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import config from '~utils/config'
import { getHeaders } from './getHeaders'

export function createWebSocketLink() {
	const headers = getHeaders()
	return new WebSocketLink(
		new SubscriptionClient(config.api.socketUrl, {
			lazy: true,
			reconnect: true,
			reconnectionAttempts: 3,
			connectionParams: {
				headers
			}
		})
	)
}
