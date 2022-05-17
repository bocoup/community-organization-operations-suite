/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ApolloLink, NormalizedCacheObject, Operation } from '@apollo/client/core'
import { ApolloClient, split, from } from '@apollo/client/core'
import { getMainDefinition } from '@apollo/client/utilities'
import { getCache } from './cache'
import type { History } from 'history'
import { createHttpLink } from './createHttpLink'
import { createWebSocketLink } from './createWebSocketLink'
import { createErrorLink } from './createErrorLink'
import type QueueLink from '../utils/queueLink'

/**
 * Configures and creates the Apollo Client.
 * Because next js renders on the server and client we need to use httplink on the server and split
 * between authorized httplink and a websocket link depending on the gql query
 *
 * @returns {ApolloClient} configured apollo client
 */

const isNodeServer = typeof window === 'undefined'

export function createApolloClient(
	history: History,
	queueLink: QueueLink
): ApolloClient<NormalizedCacheObject> {
	return new ApolloClient({
		ssrMode: isNodeServer,
		link: createRootLink(history, queueLink),
		cache: getCache()
	})
}

function createRootLink(history: History, queueLink: QueueLink) {
	const httpLink = createHttpLink()

	if (isNodeServer) return httpLink

	const errorLink = createErrorLink(history)
	const wsLink = createWebSocketLink()

	// The `from` function combines an array of individual links
	// into a link chain: Offline -> Error -> API Server
	return from([
		queueLink as unknown as ApolloLink,
		errorLink,
		split(isSubscriptionOperation, wsLink, httpLink)
	])
}

function isSubscriptionOperation({ query }: Operation) {
	const definition = getMainDefinition(query)
	return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
}
