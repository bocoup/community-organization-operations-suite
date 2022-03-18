/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const fs = require('fs')
const path = require('path')

const LOCALE_DIR = path.join(__dirname, '../src/locales')
const OUTPUT_DIR = path.join(__dirname, '../public/localizations')
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR)
}

const locales = fs.readdirSync(LOCALE_DIR)
locales.forEach(generateLocaleFile)

function generateLocaleFile(locale) {
	console.log(`generating localization for ${locale} from ${path.join(LOCALE_DIR, locale)}`)
	const localeFiles = fs.readdirSync(path.join(LOCALE_DIR, locale))
	const localeDocument = {}
	localeFiles.forEach((file) => {
		const filePath = path.join(LOCALE_DIR, locale, file)
		localeDocument[file.replace('.json', '')] = JSON.parse(
			fs.readFileSync(filePath, { encoding: 'utf-8' })
		)
	})

	fs.writeFileSync(path.join(OUTPUT_DIR, locale + '.json'), JSON.stringify(localeDocument, null, 2))
}
