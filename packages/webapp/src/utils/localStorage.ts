/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const ACCESS_TOKEN_KEY = 'access_token'
const LOCALE_KEY = 'locale'
const DEFAULT_LOCALE = 'en-US'
const FCM_TOKEN_KEY = 'fcm_token'
const RECOIL_PERSIST_KEY = 'recoil-persist'

export function clearStoredState() {
	localStorage.removeItem(FCM_TOKEN_KEY)
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(RECOIL_PERSIST_KEY)
}

export function storeAccessToken(token: string) {
	localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function retrieveAccessToken() {
	return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function storeLocale(locale: string) {
	localStorage.setItem(LOCALE_KEY, locale)
}

export function retrieveLocale() {
	return localStorage.getItem(LOCALE_KEY) || DEFAULT_LOCALE
}

export function storeFcmToken(token: string) {
	localStorage.setItem(FCM_TOKEN_KEY, token)
}

export function retrieveFcmToken() {
	return localStorage.getItem(FCM_TOKEN_KEY)
}
