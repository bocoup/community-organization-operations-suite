/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { get } from 'lodash'

const httpLink = createHttpLink({
	uri: `${process.env.API_URL}/graphql`
})

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = get(JSON.parse(localStorage.getItem('recoil-persist')), 'userAuthState.accessToken')

	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})
