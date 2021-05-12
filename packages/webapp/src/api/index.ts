/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
	uri: '/api/graphql',
	cache: new InMemoryCache()
})
