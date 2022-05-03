/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NormalizedCacheObject, Operation } from '@apollo/client/core'
import { ApolloClient, split, from } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { getCache } from './cache'
import type { History } from 'history'
import { createHttpLink } from './createHttpLink'
import { createWebSocketLink } from './createWebSocketLink'
import { createErrorLink } from './createErrorLink'
import type QueueLink from 'apollo-link-queue'

/**
 * Configures and creates the Apollo Client.
 * Because next js renders on the server and client we need to use httplink on the server and split
 * between authorized httplink and a websocket link depending on the gql query
 *
 * @param initialState Initial state to set in memory cache.
 * @param headers
 * @returns {ApolloClient} configured apollo client
 */
export function createApolloClient(
	history: History,
	queueLink: QueueLink
): ApolloClient<NormalizedCacheObject> {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createRootLink(history, queueLink),
		cache: getCache()
	})
}

function createRootLink(history: History, queueLink: QueueLink) {
	if (typeof window === 'undefined') {
		return createHttpLink()
	} else {
		const errorLink = createErrorLink(history)
		const httpLink = createHttpLink()
		const wsLink = createWebSocketLink()
		return from([
			queueLink as unknown as ApolloLink,
			errorLink,
			split(isSubscriptionOperation, wsLink, httpLink)
		])
	}
}

function isSubscriptionOperation({ query }: Operation) {
	const definition = getMainDefinition(query)
	return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
}
