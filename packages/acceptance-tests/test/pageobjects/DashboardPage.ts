/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	// Top row action buttons
	btnNewRequest: `.btnNewRequest button`,
	btnStartService: `.btnStartService button`,
	btnAddClient: `.btnAddClient button`,

	// My Request List
	myRequestList: '.myRequestList',
	myRequestListCollapser: '.myRequestList .collapser',
	myRequestListSearch: '.myRequestList .list-search',
	myRequestRow: '.myRequestList .data-row',

	// Org Request List
	requestList: '.requestList',
	requestListCollapser: '.requestList .collapser',
	requestListSearch: '.requestList .list-search',
	requestRow: '.requestList .data-row',

	// Closed Request List
	closedRequestList: '.inactiveRequestList',
	closedRequestListCollapser: '.inactiveRequestList .collapser',
	closedRequestListSearch: '.inactiveRequestList .list-search',
	closedRequestRow: '.inactiveRequestList .data-row',

	lblNewRequest: '.btnNewRequest h2'
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

	public async getNewRequestLabel(): Promise<string> {
		return this.page.innerText(selectors.lblNewRequest)
	}

	public async expandRequestList() {
		await this.page.click(selectors.requestListCollapser)
		await this.page.waitForSelector(selectors.requestListSearch, { state: 'visible' })
	}

	public async expandClosedRequestList() {
		await this.page.click(selectors.closedRequestListCollapser)
		await this.page.waitForSelector(selectors.closedRequestListSearch, { state: 'visible' })
	}

	public async expandMyRequestList() {
		await this.page.click(selectors.myRequestListCollapser)
		await this.page.waitForSelector(selectors.myRequesStListSearch, { state: 'visible' })
	}
	public async waitForRequestData() {
		await this.page.waitForSelector(selectors.requestRow)
	}

	public async waitForClosedRequestData() {
		await this.page.waitForSelector(selectors.closedRequestRow)
	}

	public async countRequestsVisible() {
		const items = await this.page.$$(selectors.requestRow)
		return items.length
	}

	public async countClosedRequestsVisible() {
		const items = await this.page.$$(selectors.closedRequestRow)
		return items.length
	}

	public async countMyRequestsVisible() {
		const items = await this.page.$$(selectors.myRequestRow)
		return items.length
	}
}
