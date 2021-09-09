/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo } from 'react'
import { defineMessages } from 'react-intl'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import get from 'lodash/get'
import template from 'lodash/template'
import templateSettings from 'lodash/templateSettings'
import { useLocale, DEFAULT_LOCALE } from './useLocale'

templateSettings.interpolate = /\[\[([\s\S]+?)\]\]/g

function applyTemplate(message: string, options: Record<string, any> = {}) {
	return template(message)(options)
}

function getMessage(key: string, namespaces: string[], library: Record<string, any>) {
	const message = get(library, key)
	if (message != null) {
		return message
	}
	for (const ns of namespaces) {
		const message = get(library, `${ns}.${key}`)
		if (message) {
			return message
		}
	}
	return null
}

export function useTranslation(namespaces?: string[] | string) {
	const library = useLocaleStrings()

	return useMemo(() => {
		const ns = namespaces == null ? [] : Array.isArray(namespaces) ? namespaces : [namespaces]
		return {
			c: (key: string, options?: Record<string, any>) => {
				let message = get(library, `common.${key}`)
				if (Object.keys(library).length > 0 && message == null) {
					message = get(library, `defaultLibrary.common.${key}`)

					if (message == null) {
						console.warn('Could not locate common message for ', key)
					}
				}
				return applyTemplate(message, options)
			},
			t: (key: string, options?: Record<string, any>) => {
				let message = getMessage(key, ns, library)
				if (Object.keys(library).length > 0 && message == null) {
					message = getMessage(
						key,
						ns.map((n) => `defaultLibrary.${n}`),
						library
					)

					if (message == null) {
						console.warn('Could not locate message for ', key)
					}
				}
				return applyTemplate(message, options)
			}
		}
	}, [library, namespaces])
}

export function useLocaleMessages(locale: string) {
	const messageState = messageStateFor(locale)
	const [state, setState] = useRecoilState(messageState)

	console.log('messageState', messageState)

	useEffect(() => {
		if (Object.keys(state).length === 0) {
			fetch(`/localizations/${locale}.json`)
				.then((res) => res.json())
				.then((jsonData) => {
					// Set default user locale messages
					const messages = defineMessages(jsonData)
					setState(messages)

					// Load default local state
					if (locale !== DEFAULT_LOCALE)
						fetch(`/localizations/${DEFAULT_LOCALE}.json`)
							.then((res) => res.json())
							.then((jsonData) => {
								const _messages = defineMessages(jsonData)

								// Set default locale messages
								setState({ ...messages, defaultLibrary: _messages })
							})
				})
		}
	}, [locale, setState, state])

	return state
}

// globally tracked atoms of locale state, avoids atom duplication
const localeState: Record<string, any> = {}

function messageStateFor(locale: string) {
	if (!localeState[locale]) {
		localeState[locale] = atom({ key: `messages:${locale}`, default: {} })
	}
	return localeState[locale]
}

function useLocaleStrings() {
	const [locale] = useLocale()
	const libraryState = messageStateFor(locale)
	useLocaleMessages(locale)
	return useRecoilValue(libraryState)
}
