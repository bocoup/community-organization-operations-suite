/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { HttpLink } from '@apollo/client'
import { config } from '~utils/config'
import { getHeaders } from './getHeaders'
import { setContext } from '@apollo/client/link/context'

export function createHttpLink() {
	// Get the authentication token from local storage if it exists
	const authLink = setContext((_, { headers }) => {
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				...getHeaders()
			}
		}
	})

	const httpLink = createRawHttpLink()
	return authLink.concat(httpLink)
}

function createRawHttpLink() {
	const httpLink = new HttpLink({
		uri: config.api.url,
		headers: getHeaders(),
		fetch
	})

	return httpLink
}
