/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class Header extends Page {
	/**
	 * define selectors using getter methods
	 */
	public get personaMenuButton() {
		return $('[data-testid="persona-menu-container"]')
	}
	public get viewAccountButton() {
		return $('.view-account')
	}
	public get logoutButton() {
		return $('.logout')
	}

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('/')
	}

	public async logout() {
		await this.personaMenuButton.click()
		await this.logoutButton.waitForExist()
		await this.logoutButton.click()
	}

	public async viewAccount() {
		await this.personaMenuButton.click()
		await this.viewAccountButton.waitForExist()
		await this.viewAccountButton.click()
	}

	public async waitForLoad(): Promise<void> {
		await this.personaMenuButton.waitForExist()
	}
}

export default new Header()
