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

	/**
	 * overwrite specifc options to adapt it to page object
	 */
	public open() {
		return super.open('')
	}

	public async waitForLoad(): Promise<void> {
		await this.requestList.waitForExist()
	}
}

export default new DashboardPage()
