/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { remote, Browser } from 'webdriverio'

let browser: Browser<'async'>

async function executeTests() {
	browser = await remote({
		capabilities: { browserName: 'chrome' }
	})

	await browser.navigateTo('https://www.google.com/ncr')

	const searchInput = await browser.$('#lst-ib')
	await searchInput.setValue('WebdriverIO')

	const searchBtn = await browser.$('input[value="Google Search"]')
	await searchBtn.click()

	console.log(await browser.getTitle()) // outputs "WebdriverIO - Google Search"
}

executeTests()
	.catch((err) => console.error(err))
	.finally(() => browser.deleteSession())
