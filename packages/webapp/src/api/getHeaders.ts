/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import get from 'lodash/get'

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
	const persistedData = JSON.parse(localStorage.getItem('recoil-persist'))

	// Get values from recoil local store
	const accessToken = get(persistedData, 'userAuthState.accessToken')
	const accept_language = localStorage.getItem('locale') || ''

	// Return node friendly headers
	return {
		authorization: accessToken ? `Bearer ${accessToken}` : '',
		accept_language
	}
}
