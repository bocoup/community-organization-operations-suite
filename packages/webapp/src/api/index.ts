/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { ApolloClient, InMemoryCache } from '@apollo/client'
import {
	ApolloClient,
	split,
	HttpLink,
	InMemoryCache,
	NormalizedCache,
	NormalizedCacheObject
} from '@apollo/client'
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { get } from 'lodash'

const createAuthorizationHeader = async () => {
	if (typeof window === 'undefined') return ''

	const accessToken = get(
		JSON.parse(localStorage.getItem('recoil-persist')),
		'userAuthState.accessToken'
	)

	return accessToken ? `Bearer ${accessToken}` : ''
}

const createHttpLink = headers => {
	const authorization = createAuthorizationHeader()

	const httpLink = new HttpLink({
		uri: `${process.env.API_URL}/graphql`,
		credentials: 'include',
		headers: {
			...headers,
			authorization
		},
		fetch
	})
	return httpLink
}

const createAuthLink = headers => {
	// Get the authentication token from local storage if it exists
	const authorization = createAuthorizationHeader()

	const _authLink = setContext((_, { headers }) => {
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				authorization
			}
		}
	})

	const httpLink = new HttpLink({
		uri: `${process.env.API_URL}/graphql`,
		credentials: 'include',
		headers: {
			...headers,
			authorization
		},
		fetch
	})

	return _authLink.concat(httpLink)
}

const createWSLink = headers => {
	const authorization = createAuthorizationHeader()

	return new WebSocketLink(
		new SubscriptionClient(`wss://${process.env.API_HOST}/graphql`, {
			lazy: true,
			reconnect: true,
			connectionParams: async () => {
				return {
					headers: {
						...headers,
						authorization
					}
				}
			}
		})
	)
}

const createSplitLink = headers => {
	const authLink = createAuthLink(headers)
	const wsLink = createWSLink(headers)

	split(
		({ query }) => {
			const definition = getMainDefinition(query)
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
		},
		wsLink,
		authLink.concat(httpLink)
	)
}

export function createApolloClient(initialState, headers): ApolloClient<NormalizedCacheObject> {
	const ssrMode = typeof window === 'undefined'
	let link

	if (ssrMode) {
		link = createHttpLink(headers) // executed on server
	} else {
		link = createSplitLink() // executed on client
	}

	return new ApolloClient({
		ssrMode,
		link,
		cache: new InMemoryCache().restore(initialState)
	})
}

// const wsLink = new WebSocketLink({
// 	uri: `ws://${process.env.API_HOST}/subscriptions`,
// 	options: {
// 		reconnect: true
// 	}
// })

// const httpLink = new HttpLink({
// 	uri: `${process.env.API_URL}/graphql`
// })

// const authLink = setContext((_, { headers }) => {
// 	// get the authentication token from local storage if it exists
// 	const token = get(JSON.parse(localStorage.getItem('recoil-persist')), 'userAuthState.accessToken')

// 	// return the headers to the context so httpLink can read them
// 	return {
// 		headers: {
// 			...headers,
// 			Authorization: token ? `Bearer ${token}` : ''
// 		}
// 	}
// })

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value

// export const client = new ApolloClient({
// 	link: splitLink,
// 	cache: new InMemoryCache({
// 		typePolicies: {
// 			Query: {
// 				fields: {
// 					engagements: offsetLimitPagination(['userId', 'exclude_userId'])
// 				}
// 			}
// 		}
// 	})
// })

// export const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {

// 	const _client = new ApolloClient({
// 		link: splitLink,
// 		cache: new InMemoryCache({
// 			typePolicies: {
// 				Query: {
// 					fields: {
// 						engagements: offsetLimitPagination(['userId', 'exclude_userId'])
// 					}
// 				}
// 			}
// 		})
// 	})

// 	return _client
// }
