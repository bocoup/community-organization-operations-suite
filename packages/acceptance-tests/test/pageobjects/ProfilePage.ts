/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	form: '.profileForm',
	languageDropdown: '#languageDropdown',
	englishButton: '#languageDropdown-list0',
	spanishButton: '#languageDropdown-list1'
}
export class ProfilePage extends Page {
	public async waitForLoad() {
		// await super.waitForLoad()
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public open() {
		return super.open('account')
	}

	public async clickLanguageDropdown() {
		await this.page.click(selectors.languageDropdown)
	}

	public async clickEnglishButton() {
		await this.page.click(selectors.englishButton)
	}

	public async clickSpanishButton() {
		await this.page.click(selectors.spanishButton)
	}
}
