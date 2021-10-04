/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	requestList: '[data-testid="request-list"]',
	btnNewRequest: `[data-testid="btnNewRequest"]`,
	btnStartService: `[data-testid="btnStartService"]`,
	btnAddClient: `[data-testid="btnAddClient"]`
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class DashboardPage extends Page {
	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('')
	}

	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.requestList, { state: 'visible' })
	}

	public async clickNewRequest(): Promise<void> {
		await this.page.click(selectors.btnNewRequest)
	}

	public async clickNewClient(): Promise<void> {
		await this.page.click(selectors.btnAddClient)
	}

	public async clickStartService(): Promise<void> {
		await this.page.click(selectors.btnStartService)
	}

	public async clickAddClient(): Promise<void> {
		await this.page.click(selectors.btnAddClient)
	}
}
