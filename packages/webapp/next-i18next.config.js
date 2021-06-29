/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

const path = require('path')

module.exports = {
	i18n: {
		// These are all the locales you want to support in
		// your application
		locales: ['en', 'es'],
		// This is the default locale you want to beed when visiting
		// a non-locale prefixed path e.g. `/hello`
		defaultLocale: 'en'
	},
	localePath: path.resolve('./src/locales')
}
