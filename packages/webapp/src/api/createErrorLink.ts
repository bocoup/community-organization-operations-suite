/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { onError } from '@apollo/client/link/error'
import { createLogger } from '~utils/createLogger'
import { History } from 'history'
const logger = createLogger('api')

export function createErrorLink(history: History) {
	return onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors)
			graphQLErrors.forEach(({ message, locations, path }) => {
				logger(
					`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
						locations
					)}, Path: ${path}`
				)
				if (message === 'UNAUTHENTICATED') {
					history.push('/login/?error=UNAUTHENTICATED')
				}
			})

		if (networkError) {
			logger(`[Network error]: ${networkError}`)
		}
	})
}
