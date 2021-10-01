/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DashboardPage extends Page {
	/**
	 * define selectors using getter methods
	 */
	private get requestList() {
		return $('[data-testid="request-list"]')
	}

	private get btnNewRequest() {
		return $(`[data-testid="btnNewRequest"]`)
	}

	private get btnStartService() {
		return $(`[data-testid="btnStartService"]`)
	}

	private get btnAddClient() {
		return $(`[data-testid="btnAddClient"]`)
	}

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('')
	}

	public async waitForLoad(): Promise<void> {
		await this.requestList.waitForExist()
	}

	public async clickNewRequest(): Promise<void> {
		await this.btnNewRequest.click()
	}

	public async clickStartService(): Promise<void> {
		await this.btnStartService.click()
	}

	public async clickAddClient(): Promise<void> {
		await this.btnAddClient.click()
	}
}

export default new DashboardPage()
