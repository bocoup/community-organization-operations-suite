/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'
declare const $: any

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
	/**
	 * define selectors using getter methods
	 */
	private get inputUsername() {
		return $('#username')
	}
	private get inputPassword() {
		return $('#password')
	}
	private get btnSubmit() {
		return $('button[type="submit"]')
	}

	/**
	 * a method to encapsule automation code to interact with the page
	 * e.g. to login using username and password
	 */
	public async login(username: string, password: string) {
		await this.inputUsername.setValue(username)
		await this.inputPassword.setValue(password)
		await this.btnSubmit.click()
	}

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('login')
	}
}

export default new LoginPage()
