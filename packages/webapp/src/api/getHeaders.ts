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

	// Get accessToken from recoil local store
	const accessToken = get(
		JSON.parse(localStorage.getItem('recoil-persist')),
		'userAuthState.accessToken'
	)

	// Get locale from local store
	const accept_language = localStorage.getItem('locale') || ''

	// Get user from recoil local storage
	const user_id =
		get(JSON.parse(localStorage.getItem('recoil-persist')), 'currentUserState.id') ?? ''

	// Get orgId from recoil local store
	const org_id =
		get(JSON.parse(localStorage.getItem('recoil-persist')), 'organizationState.id') ?? ''

	// Return node friendly headers
	return {
		authorization: accessToken ? `Bearer ${accessToken}` : '',
		accept_language,
		user_id,
		org_id
	}
}
