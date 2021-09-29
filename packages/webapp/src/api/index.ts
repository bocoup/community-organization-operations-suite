/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloClient, split, from, NormalizedCacheObject, Operation } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { getCache } from './cache'
import { History } from 'history'
import { createHttpLink } from './createHttpLink'
import { createWebSocketLink } from './createWebSocketLink'
import { createErrorLink } from './createErrorLink'

/**
 * Configures and creates the Apollo Client.
 * Because next js renders on the server and client we need to use httplink on the server and split
 * between authorized httplink and a websocket link depending on the gql query
 *
 * @param initialState Initial state to set in memory cache.
 * @param headers
 * @returns {ApolloClient} configured apollo client
 */
export function createApolloClient(history: History): ApolloClient<NormalizedCacheObject> {
	return new ApolloClient({
		link: createRootLink(history),
		cache: getCache()
	})
}

function createRootLink(history: History) {
	const errorLink = createErrorLink(history)
	const httpLink = createHttpLink()
	const wsLink = createWebSocketLink()
	return from([errorLink, split(isSubscriptionOperation, wsLink, httpLink)])
}

function isSubscriptionOperation({ query }: Operation) {
	const definition = getMainDefinition(query)
	return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
}
