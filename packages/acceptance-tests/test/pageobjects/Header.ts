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
	private get personaMenuButton() {
		return $('[data-testid="persona-menu-container"]')
	}
	private get viewAccountButton() {
		return $('.view-account')
	}
	private get logoutButton() {
		return $('.logout')
	}
	private get servicesLink() {
		return $('a[href="/services/"]')
	}
	private get specialistsLink() {
		return $('a[href="/specialist/"]')
	}
	private get clientsLink() {
		return $('a[href="/clients/"]')
	}
	private get tagsLink() {
		return $('a[href="/tags/"]')
	}
	private get reportingLink() {
		return $('a[href="/reporting/"]')
	}

	/**
	 * overwrite specific options to adapt it to page object
	 */
	public open() {
		return super.open('')
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

	public async clickServices() {
		await this.servicesLink.click()
	}

	public async clickSpecialists() {
		await this.specialistsLink.click()
	}

	public async clickClients() {
		await this.clientsLink.click()
	}

	public async clickTags() {
		await this.tagsLink.click()
	}

	public async clickReporting() {
		await this.reportingLink.click()
	}
}

export default new Header()
