/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const fs = require('fs')
const path = require('path')

const LOCALE_DIR = path.join(__dirname, 'src/locales')

function lintLocaleFiles(locale) {
	const localeFiles = fs.readdirSync(path.join(LOCALE_DIR, locale))
	localeFiles.forEach(f => {
		const data = require(path.join(LOCALE_DIR, locale, f))
		lintDataFile(data, locale + ': ' + f + '@')
	})
}

function lintDataFile(data, path) {
	const keys = Object.keys(data)
	keys.forEach(key => {
		let localPath = path + `.${key}`
		if (key.endsWith('.comment') && !isComment(key)) {
			const error = `"${localPath}" is not a proper comment key`
			errors.push(error)
			console.error(error)
		} else if (key.indexOf('.') > -1 && !isComment(key)) {
			const error = `"${localPath}" should not contain a dot property`
			errors.push(error)
			console.error(error)
		}
		if (typeof data[key] !== 'string') {
			lintDataFile(data[key], localPath)
		}
	})
}

function isComment(t) {
	return t.startsWith('_') && t.endsWith('.comment')
}

let errors = []
const locales = fs.readdirSync(LOCALE_DIR)
locales.forEach(lintLocaleFiles)

if (errors.length > 0) {
	console.error(errors.length + ' errors')
	process.exit(1)
} else {
	console.log('localization files linted')
	process.exit(0)
}
