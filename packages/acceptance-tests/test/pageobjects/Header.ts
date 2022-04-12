/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	btnMenu: '.personaMenuContainer',
	btnLogout: '.logout',
	btnViewAccount: '.view-account',
	dashboardLink: '.topNavDashboard',
	servicesLink: '.topNavServices',
	specialistsLink: '.topNavSpecialists',
	clientsLink: '.topNavClients',
	tagsLink: '.topNavTags',
	reportingLink: '.topNavReporting',
	notificationsBell: '#notifications-bell',
	notificationsPanel: '#notifications-panel'
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

	public async clickDashboardLink() {
		return await this.page.click(selectors.dashboardLink)
	}

	public async clickServicesLink() {
		await await this.page.click(selectors.servicesLink)
	}

	public async clickSpecialistsLink() {
		await this.page.click(selectors.specialistsLink)
	}

	public async clickClientsLink() {
		await this.page.click(selectors.clientsLink)
	}

	public async clickTagsLink() {
		await this.page.click(selectors.tagsLink)
	}

	public async clickReportingLink() {
		await this.page.click(selectors.reportingLink)
	}

	public async clickNotificationsBell() {
		await this.page.click(selectors.notificationsBell)
	}

	public async waitForNotificationsPanelToShow() {
		await this.page.waitForSelector(selectors.notificationsPanel, { state: 'visible' })
	}

	public async waitForNotificationsPanelToClear() {
		await this.page.waitForSelector(selectors.notificationsPanel, { state: 'hidden' })
	}
}
