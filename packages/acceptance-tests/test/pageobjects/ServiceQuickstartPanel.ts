/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	serviceRow: '.servicePanelItem',
	serviceRowStartButton: '.servicePanelItem button',
	btnClose: `button[title="Close"]`,
	panelTitle: 'text="Start a Service"'
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class ServiceQuickstartPanel extends Page {
	public async waitForLoad(): Promise<void> {
		await this.page.waitForSelector(selectors.panelTitle, { state: 'visible' })
		await this.page.waitForSelector(selectors.serviceRow, { state: 'visible' })
	}

	public async closePanel(): Promise<void> {
		await this.page.click(selectors.btnClose)
		await this.page.waitForSelector(selectors.form, { state: 'detached' })
	}

	public async isSubmitEnabled(): Promise<boolean> {
		const btnSubmit = await this.page.$(selectors.btnCreateRequest)
		return btnSubmit?.isEnabled() ?? false
	}

	public async getAvailableServices() {
		const items = await this.page.$$(selectors.serviceRow)
		return items
	}

	public async clickRecordService(index: number) {
		const items = await this.page.$$(selectors.serviceRowStartButton)
		await items[index].click()
	}
}
