/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloClient, split, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { get } from 'lodash'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const createAuthorizationHeader = () => {
	if (typeof window === 'undefined') return ''

	const accessToken = get(
		JSON.parse(localStorage.getItem('recoil-persist')),
		'userAuthState.accessToken'
	)

	return accessToken ? `Bearer ${accessToken}` : ''
}

const createLocalizationHeader = () => {
	if (typeof window === 'undefined') return ''

	return localStorage.getItem('locale') || ''
}

const createHttpLink = () => {
	const authorization = createAuthorizationHeader()
	const acceptLanguage = createLocalizationHeader()

	const httpLink = new HttpLink({
		uri: process.env.API_URL,
		headers: {
			authorization,
			acceptLanguage
		}
	})

	return httpLink
}

const createAuthLink = () => {
	// Get the authentication token from local storage if it exists
	const authorization = createAuthorizationHeader()
	const acceptLanguage = createLocalizationHeader()

	const _authLink = setContext((_, { headers }) => {
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				authorization,
				acceptLanguage
			}
		}
	})

	const httpLink = createHttpLink()

	return _authLink.concat(httpLink)
}

const createWebSocketLink = () => {
	const authorization = createAuthorizationHeader()
	const acceptLanguage = createLocalizationHeader()

	return new WebSocketLink(
		new SubscriptionClient(process.env.API_SOCKET_URL, {
			lazy: true,
			reconnect: true,
			reconnectionAttempts: 3,
			connectionParams: async () => {
				return {
					headers: {
						authorization,
						acceptLanguage
					}
				}
			}
		})
	)
}

const createSplitLink = () => {
	const authLink = createAuthLink()
	const wsLink = createWebSocketLink()

	return split(
		({ query }) => {
			const definition = getMainDefinition(query)
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
		},
		wsLink,
		authLink
	)
}

// TODO: check for previously created apollo client and return that instead

/**
 * Configures and creates the Apollo Client.
 * Because next js renders on the server and client we need to use httplink on the server and split
 * between authorized httplink and a websocket link depending on the gql query
 *
 * @param initialState Initial state to set in memory cache.
 * @param headers
 * @returns {ApolloClient} configured apollo client
 *
 * TODO: Consider saving created apollo client so that on repeat calls this function returns the cached client?
 */
export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
	const ssrMode = typeof window === 'undefined'
	let link

	if (ssrMode) {
		link = createHttpLink() // executed on server
	} else {
		link = createSplitLink() // executed on client
	}

	return new ApolloClient({
		ssrMode,
		link,
		cache: new InMemoryCache()
	})
}
