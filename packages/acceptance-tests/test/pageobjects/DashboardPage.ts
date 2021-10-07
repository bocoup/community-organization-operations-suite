/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	requestList: '.requestList',
	requestListCollapser: '.requestList .collapser',
	closedRequestList: '.inactiveRequestList',
	closedRequestListCollapser: '.inactiveRequestList .collapser',
	myRequestList: '.myRequestList',
	myRequestListCollapser: '.myRequestList .gollapser',
	btnNewRequest: `.btnNewRequest`,
	btnStartService: `.btnStartService`,
	btnAddClient: `.btnAddClient`,
	lblNewRequest: '.btnNewRequest h2',
	requestListSearch: '.requestList .list-search',
	closedRequestListSearch: '.closedRequestList .list-search',
	myRequestListSearch: '.myRequestList .list-search',
	requestRow: '.requestList .data-row',
	closedRequestRow: '.inactiveRequestList .data-row',
	myRequestRow: '.myRequestList .data-row'
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

	public async clickRequestListCollapser() {
		await this.page.click(selectors.requestListCollapser)
	}

	public async clickClosedRequestListCollapser() {
		await this.page.click(selectors.closedRequestListCollapser)
	}

	public async clickMyRequestListCollapser() {
		await this.page.click(selectors.myRequestListCollapser)
	}

	public async clickAddClient(): Promise<void> {
		await this.page.click(selectors.btnAddClient)
	}

	public async getNewRequestLabel(): Promise<string> {
		return this.page.innerText(selectors.lblNewRequest)
	}

	public async waitForRequestListCollapse() {
		await this.page.waitForSelector(selectors.requestListSearch, { state: 'hidden' })
	}

	public async waitForClosedRequestListCollapse() {
		await this.page.waitForSelector(selectors.closedRequestListSearch, { state: 'hidden' })
	}

	public async waitForMyRequestListCollapse() {
		await this.page.waitForSelector(selectors.closedRequestListSearch, { state: 'hidden' })
	}

	public async waitForRequestListExpanded() {
		await this.page.waitForSelector(selectors.requestListSearch, { state: 'visible' })
	}

	public async waitForClosedRequestListExpanded() {
		await this.page.waitForSelector(selectors.closedRequestListSearch, { state: 'visible' })
	}

	public async waitForMyRequestListExpanded() {
		await this.page.waitForSelector(selectors.myRequestListSearch, { state: 'visible' })
	}

	public async waitForRequestRows() {
		await this.page.waitForSelector(selectors.requestRow)
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
