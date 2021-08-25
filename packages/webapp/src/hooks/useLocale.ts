/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'

const localeState = atom({
	key: 'locale',
	default: 'en-US'
})

export const LOCALES = ['en-US', 'es-US']

const DEFAULT_LOCALE = 'en-US'
function getLocale(language: string) {
	if (language.startsWith('en-') || language === 'en') {
		return 'en-US'
	} else if (language.startsWith('es-') || language === 'es') {
		return 'es-US'
	}
	return DEFAULT_LOCALE
}

let localeInitialized = false
export function useLocale(localeProp?: string | undefined): [string, (locale: string) => void] {
	const [locale, setLocale] = useRecoilState(localeState)

	useEffect(() => {
		if (localeInitialized) {
			return
		}
		let isSet = false
		if (localeProp && typeof localStorage !== 'undefined') {
			// 1: If the locale prop is explicitly set, save the setting and use that locale
			console.log('set router locale', localeProp)
			localStorage.setItem('locale', localeProp)
			setLocale(localeProp)
			isSet = true
		} else if (localStorage !== undefined) {
			// 2: If localStorage has a valid locale entry, use that
			const locale = localStorage.getItem('locale')
			if (locale != null) {
				console.log('set localstorage locale', locale)
				setLocale(locale)
				isSet = true
			}
		}

		if (!isSet) {
			// 3: Use browser default locale
			console.log('set default locale', navigator.language)
			setLocale(getLocale(navigator.language))
		}

		localeInitialized = true
	}, [setLocale, localeProp])

	useEffect(() => {
		// pack configured locale into localeStorage
		if (localStorage !== undefined) {
			localStorage.setItem('locale', locale)
		}
	}, [locale])

	return [locale, setLocale]
}
