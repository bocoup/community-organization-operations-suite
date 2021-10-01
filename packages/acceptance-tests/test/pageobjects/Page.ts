/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
	protected get waitSpinners() {
		return $('.waitSpinner')
	}

	protected waitForLoad() {
		this.waitSpinners.waitUntil(async function (this: WebdriverIO.Element) {
			return (await this.isDisplayed()) === false
		})
	}

	/**
	 * Opens a sub page of the page
	 * @param path path of the sub page (e.g. /path/to/page.html)
	 */
	protected async open(path: string): Promise<void> {
		browser.url(`/${path}`)
	}
}
