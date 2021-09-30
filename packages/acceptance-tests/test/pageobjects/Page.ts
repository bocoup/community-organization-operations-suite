/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
declare const browser: any
/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
	/**
	 * Opens a sub page of the page
	 * @param path path of the sub page (e.g. /path/to/page.html)
	 */
	open(path: string) {
		return browser.url(`/${path}`)
	}
}
