/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloClient, split, from, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { get } from 'lodash'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getCache } from './cache'

/**
 * Gets headers from localeStorage and recoil persist (also in localStorage)
 *
 * @returns node friendly headers
 */
const getHeaders = (): {
	authorization?: string
	accept_language?: string
	user_id?: string
	org_id?: string
} => {
	if (typeof window === 'undefined') return {}

	// Get accessToken from recoil local store
	const accessToken = get(
		JSON.parse(localStorage.getItem('recoil-persist')),
		'userAuthState.accessToken'
	)

	// Get locale from local store
	const accept_language = localStorage.getItem('locale') || ''

	// Get user from recoil local storage
	const user_id =
		get(JSON.parse(localStorage.getItem('recoil-persist')), 'currentUserState.id') ?? ''

	// Get orgId from recoil local store
	const org_id =
		get(JSON.parse(localStorage.getItem('recoil-persist')), 'organizationState.id') ?? ''

	// Return node friendly headers
	return {
		authorization: accessToken ? `Bearer ${accessToken}` : '',
		accept_language,
		user_id,
		org_id
	}
}

const createHttpLink = () => {
	const httpLink = new HttpLink({
		uri: process.env.API_URL,
		headers: getHeaders()
	})

	return httpLink
}

const createAuthLink = () => {
	// Get the authentication token from local storage if it exists
	const _authLink = setContext((_, { headers }) => {
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				...getHeaders()
			}
		}
	})

	const httpLink = createHttpLink()

	return _authLink.concat(httpLink)
}

const createWebSocketLink = () => {
	const headers = getHeaders()
	return new WebSocketLink(
		new SubscriptionClient(process.env.API_SOCKET_URL, {
			lazy: true,
			reconnect: true,
			reconnectionAttempts: 3,
			connectionParams: {
				headers
			}
		})
	)
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.forEach(({ message, locations, path }) => {
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
					locations
				)}, Path: ${path}`
			)
			if (message === 'UNAUTHENTICATED') window.location.href = '/login/?error=UNAUTHENTICATED'
		})

	if (networkError) console.log(`[Network error]: ${networkError}`)
})

const createSplitLink = () => {
	const authLink = createAuthLink()
	const wsLink = createWebSocketLink()

	return from([
		errorLink,
		split(
			({ query }) => {
				const definition = getMainDefinition(query)
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
			},
			wsLink,
			authLink
		)
	])
}

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
		cache: getCache()
	})
}
