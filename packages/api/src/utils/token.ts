/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

const BEARER_PREFIX = 'Bearer '

/**
 * Extracts a users jwt accessToken form a client request authorization header
 *
 * @param authHeader auth header from a network request
 * @returns {string} the extracted user accessToken
 */
export function extractBearerToken(authHeader?: string): string | undefined {
	return authHeader?.slice(BEARER_PREFIX.length)
}
