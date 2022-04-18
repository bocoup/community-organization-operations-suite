/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { onError } from '@apollo/client/link/error'
import { createLogger } from '~utils/createLogger'
import type { History } from 'history'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'
const logger = createLogger('api')

export function createErrorLink(history: History) {
	return onError(({ graphQLErrors, networkError }) => {
		if (networkError) {
			logger(`[Network error]: ${networkError}`)
		}

		// Log out GraphQL Errors
		graphQLErrors?.forEach(({ message, locations, path, extensions }) => {
			logger(
				`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
					locations
				)}, Path: ${path}`,
				extensions
			)
		})

		// If auth error, navigate to login
		if (graphQLErrors?.some((e) => e?.extensions?.code === UNAUTHENTICATED)) {
			if (graphQLErrors?.some((e) => e?.extensions?.error?.name === TOKEN_EXPIRED_ERROR)) {
				navigate(history, ApplicationRoute.Login, { error: TOKEN_EXPIRED })
			} else {
				navigate(history, ApplicationRoute.Login, { error: UNAUTHENTICATED })
			}
		}
	})
}

const UNAUTHENTICATED = 'UNAUTHENTICATED'
const TOKEN_EXPIRED = 'TOKEN_EXPIRED'
const TOKEN_EXPIRED_ERROR = 'TokenExpiredError'
