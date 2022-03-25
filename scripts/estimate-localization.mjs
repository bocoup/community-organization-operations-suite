/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import chalk from 'chalk'

let wordCost = 0
const EMPTY = Object.freeze({})
const targetLocale = process.argv[2]

console.log(`estimating localization cost into locale ${targetLocale}`)

const webappEnglish = readWebappLocale('en-US')
const webappTarget = readWebappLocale(targetLocale)

const apiEnglish = readApiLocale('en-US')
const apiTarget = readApiLocale(targetLocale)

console.log('inspecting webapp localization')
inspectNode(webappEnglish, webappTarget)

console.log('inspecting API localization')
inspectNode(apiEnglish, apiTarget)

console.log('estimated word cost: ', wordCost)

/**
 * @param {string} locale
 * @returns
 */
function readWebappLocale(locale) {
	return readLocaleFolder(`./packages/webapp/src/locales/${locale}`)
}

/**
 * @param {string} locale
 * @returns
 */
function readApiLocale(locale) {
	return readLocaleFolder(`./packages/api/src/locales/${locale}`)
}

/**
 * @param {string} localeFolder
 * @returns {Record<string, any>}
 */
function readLocaleFolder(localeFolder) {
	if (existsSync(localeFolder)) {
		const files = readdirSync(localeFolder).filter((f) => f.endsWith('.json'))
		const result = {}
		files.forEach((file) => {
			const content = readFileSync(path.join(localeFolder, file))
			result[path.basename(file, '.json')] = JSON.parse(content)
		})
		return result
	} else {
		return {}
	}
}

function inspectNode(english, localization, parentPath = null) {
	Object.keys(english)
		.filter((k) => !k.endsWith('.comment'))
		.forEach((key) => {
			const keyPath = [parentPath, key].filter((t) => !!t).join('.')
			if (typeof english[key] === 'string') {
				if (!localization[key]) {
					console.log(chalk.yellow('unlocalized string: ', keyPath))
					wordCost += english[key].split(' ').length
				}
			} else {
				inspectNode(english[key], localization[key] || EMPTY, keyPath)
			}
		})
}
