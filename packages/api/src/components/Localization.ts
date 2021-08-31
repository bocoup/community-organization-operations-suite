/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { I18n } from 'i18n'
import staticCatalog from '../locales'

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

		this.#i18nProvider.configure({
			defaultLocale: 'en-US',

			// will return translation from defaultLocale in case current locale doesn't provide it
			retryInDefaultLocale: true,

			// Sets a custom header name to read the language preference from - accept-language header by default
			header: 'accept_language',

			// Fallback names of standard diviations to available formats
			fallbacks: { en: 'en-US', 'en-*': 'en-US', es: 'es-US', 'es-*': 'es-US' },

			// Enable object notation
			objectNotation: true,

			// set the language catalog statically
			// also overrides locales
			staticCatalog,

			// Use mustache with customTags (https://www.npmjs.com/package/mustache#custom-delimiters) or disable mustache entirely
			mustacheConfig: {
				tags: ['[[', ']]']
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
		this.#i18nProvider.setLocale(locale)
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
