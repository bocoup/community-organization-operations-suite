/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { retrieveAccessToken, retrieveLocale } from '~utils/localStorage'

export interface RequestHeaders {
	authorization?: string
	accept_language?: string
	user_id?: string
	org_id?: string
}
/**
 * Gets headers from localeStorage and recoil persist (also in localStorage)
 *
 * @returns node friendly headers
 */
export function getHeaders(): RequestHeaders {
	if (typeof window === 'undefined') return {}

	// Get values from recoil local store
	const accessToken = retrieveAccessToken()
	const accept_language = retrieveLocale()

	// Return node friendly headers
	const headers = {
		authorization: accessToken ? `Bearer ${accessToken}` : '',
		accept_language
	}
	return headers
}
