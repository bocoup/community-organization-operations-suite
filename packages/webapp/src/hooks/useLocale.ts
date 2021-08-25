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

const DEFAULT_LOCALE = 'en-US'
function getLocale(language: string) {
	if (language.startsWith('en-') || language === 'en') {
		return 'en-US'
	} else if (language.startsWith('es-') || language === 'es') {
		return 'es-US'
	}
	return DEFAULT_LOCALE
}

export function useLocale(localeProp?: string | undefined): string {
	const [locale, setLocale] = useRecoilState(localeState)

	useEffect(() => {
		let isSet = false
		if (localeProp && typeof localStorage !== 'undefined') {
			// 1: If the locale prop is explicitly set, save the setting and use thaht localeu
			localStorage.setItem('locale', localeProp)
			setLocale(localeProp)
			isSet = true
		} else if (localStorage !== undefined) {
			// 2: If localStorage has a valid locale entry, use that
			const locale = localStorage.getItem('locale')
			if (locale != null) {
				setLocale(locale)
				isSet = true
			}
		}

		if (!isSet) {
			// 3: Use browser default locale
			setLocale(getLocale(navigator.language))
		}
	}, [localeProp, setLocale, locale])
	return locale
}
