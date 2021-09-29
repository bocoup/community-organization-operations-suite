/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { onError } from '@apollo/client/link/error'
import { createLogger } from '~utils/createLogger'
import { Router } from 'next/router'

const logger = createLogger('api')

export function createErrorLink(router: Router) {
	return onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors)
			graphQLErrors.forEach(({ message, locations, path }) => {
				logger(
					`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
						locations
					)}, Path: ${path}`
				)
				if (message === 'UNAUTHENTICATED') {
					router.push('/login/?error=UNAUTHENTICATED')
				}
			})

		if (networkError) {
			logger(`[Network error]: ${networkError}`)
		}
	})
}
