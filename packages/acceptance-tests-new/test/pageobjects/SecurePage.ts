/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './page'
declare const $: any

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
	/**
	 * define selectors using getter methods
	 */
	get flashAlert() {
		return $('#flash')
	}
}

export default new SecurePage()
