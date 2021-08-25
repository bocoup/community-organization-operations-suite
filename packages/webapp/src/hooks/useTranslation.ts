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
import { useLocale } from './useLocale'

templateSettings.interpolate = /\[\[([\s\S]+?)\]\]/g

function applyTemplate(message: string, options: Record<string, any> = {}) {
	return template(message)(options)
}

function getMessage(key: string, namespaces: string[], library: Record<string, any>) {
	const message = get(library, key)
	if (message) {
		return message
	}
	for (const ns of namespaces) {
		const message = get(library, [ns, key])
		if (message) {
			return message
		}
	}
	return ''
}

export function useTranslation(namespaces?: string[] | string) {
	const library = useLocaleStrings()

	return useMemo(() => {
		const ns = namespaces == null ? [] : Array.isArray(namespaces) ? namespaces : [namespaces]
		return {
			c: (key: string, options?: Record<string, any>) => {
				const message = get(library, ['common', key])
				if (Object.keys(library).length > 0 && message == null) {
					console.warn('Could not locate common message for ', key)
				}
				return applyTemplate(message, options)
			},
			t: (key: string, options?: Record<string, any>) => {
				const message = getMessage(key, ns, library)
				if (Object.keys(library).length > 0 && message == null) {
					console.warn('Could not locate message for ', key)
				}
				return applyTemplate(message, options)
			}
		}
	}, [library, namespaces])
}

export function useLocaleMessages(locale: string) {
	const messageState = messageStateFor(locale)
	const [state, setState] = useRecoilState(messageState)

	useEffect(() => {
		if (Object.keys(state).length === 0) {
			fetch(`/localizations/${locale}.json`)
				.then(res => res.json())
				.then(jsonData => {
					const messages = defineMessages(jsonData)
					setState(messages)
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
	const locale = useLocale()
	const state = messageStateFor(locale)
	useLocaleMessages(locale)
	return useRecoilValue(state)
}
