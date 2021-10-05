/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	username: '[data-testid="login-username"]',
	password: '[data-testid="login-password"]',
	btnSubmit: 'button[type="submit"]',
	btnConsent: `.ms-Checkbox-checkbox`
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class LoginPage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.username, { state: 'visible' })
		await this.page.waitForSelector(selectors.password, { state: 'visible' })
		await this.page.waitForSelector(selectors.btnSubmit, { state: 'visible' })
		await this.page.waitForSelector(selectors.btnConsent, { state: 'visible' })
	}

	/**
	 * a method to encapsule automation code to interact with the page
	 * e.g. to login using username and password
	 */
	public async login(login: string, password: string) {
		await this.page.click(selectors.btnConsent)

		this.page.waitForFunction(async () => {
			const found = document.querySelector('[data-testid="login-username"]') as HTMLInputElement
			return found && !found.disabled
		})

		await this.page.fill(selectors.username, login)
		await this.page.fill(selectors.password, password)
		await this.page.click(selectors.btnSubmit)
	}

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('login')
	}
}
