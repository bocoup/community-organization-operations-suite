/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'
import DashboardPage from './DashboardPage'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
	/**
	 * define selectors using getter methods
	 */
	private get inputUsername() {
		return $('[data-testid="login-username"]')
	}
	private get inputPassword() {
		return $('[data-testid="login-password"]')
	}
	private get btnSubmit() {
		return $('button[type="submit"]')
	}
	private get btnConsentAgreement() {
		return $(`.ms-Checkbox-checkbox `)
	}

	public async waitForLoad() {
		await this.inputUsername.waitForExist()
		await this.inputPassword.waitForExist()
		await this.btnConsentAgreement.waitForExist()
		await this.btnSubmit.waitForExist()
	}

	/**
	 * a method to encapsule automation code to interact with the page
	 * e.g. to login using username and password
	 */
	public async login(username: string, password: string) {
		await this.btnConsentAgreement.click()

		await this.inputUsername.waitForEnabled()
		await this.inputUsername.setValue(username)

		await this.inputPassword.waitForEnabled()
		await this.inputPassword.setValue(password)

		await this.btnSubmit.click()
		await DashboardPage.waitForLoad()
	}

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('login')
	}
}

export default new LoginPage()
