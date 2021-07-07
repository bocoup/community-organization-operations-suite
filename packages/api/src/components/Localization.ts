/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { I18n } from 'i18n'

/**
 * Server Localization
 */
export class Localization {
	#i18nProvider: I18n

	/**
	 *
	 * @param i18nProvider The i18n provider
	 */
	public constructor() {
		this.#i18nProvider = new I18n()

		const staticCatalog = require('../locales').default

		this.#i18nProvider.configure({
			defaultLocale: 'en-US',

			// sets a custom header name to read the language preference from - accept-language header by default
			header: 'acceptLanguage',

			fallbacks: { en: 'en-US', 'en-*': 'en-US' },

			// enable object notation
			objectNotation: true,

			// set the language catalog statically
			// also overrides locales
			staticCatalog,

			// use mustache with customTags (https://www.npmjs.com/package/mustache#custom-delimiters) or disable mustache entirely
			mustacheConfig: {
				tags: ['[[', ']]'],
				disable: false
			}
		})
	}

	/**
	 *
	 * @returns {string} The current locale code
	 */

	public getCurrentLocale() {
		return this.#i18nProvider.getLocale()
	}

	/**
	 *
	 * @returns string[] The list of available locale codes
	 */

	public getLocales() {
		return this.#i18nProvider.getLocales()
	}

	/**
	 *
	 * @param locale The locale to set. Must be from the list of available locales.
	 */

	public setLocale(locale: string) {
		if (this.getLocales().indexOf(locale) !== -1) {
			this.#i18nProvider.setLocale(locale)
		}
	}

	/**
	 *
	 * @param string String to translate
	 * @param args Extra parameters
	 * @returns {string} Translated string
	 */

	public t(string: string, args?: any) {
		const translation = this.#i18nProvider.__(string, args)
		return translation
	}

	/**
	 *
	 * @param phrase Object to translate
	 * @param count The plural number
	 * @returns {string} Translated string
	 */

	public tn(phrase: string, count: number) {
		return this.#i18nProvider.__n(phrase, count)
	}
}
