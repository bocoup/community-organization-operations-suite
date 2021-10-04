/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	btnMenu: '[data-testid="persona-menu-container"]',
	btnLogout: '.logout',
	btnViewAccount: '.view-account',
	servicesLink: 'a[href="/services"]',
	specialistsLink: 'a[href="/specialist"]',
	clientsLink: 'a[href="/clients"]',
	tagsLink: 'a[href="/tags"]',
	reportingLink: 'a[href="/reporting"]'
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class Header extends Page {
	/**
	 * overwrite specific options to adapt it to page object
	 */
	public open() {
		return super.open('')
	}

	public async logout() {
		await this.page.click(selectors.btnMenu)
		await this.page.waitForSelector(selectors.btnLogout, { state: 'visible' })
		await this.page.click(selectors.btnLogout)
	}

	public async viewAccount() {
		await this.page.click(selectors.btnMenu)
		await this.page.waitForSelector(selectors.btnViewAccount, { state: 'visible' })
		await this.page.click(selectors.btnViewAccount)
	}

	public async waitForLoad(): Promise<void> {
		await this.page.waitForSelector(selectors.btnMenu, { state: 'visible' })
	}

	public async clickServices() {
		await await this.page.click(selectors.servicesLink)
	}

	public async clickSpecialists() {
		await this.page.click(selectors.specialistsLink)
	}

	public async clickClients() {
		await this.page.click(selectors.clientsLink)
	}

	public async clickTags() {
		await this.page.click(selectors.tagsLink)
	}

	public async clickReporting() {
		await this.page.click(selectors.reportingLink)
	}
}
