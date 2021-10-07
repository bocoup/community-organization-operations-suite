/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	addService: '.btnAddItem',
	serviceList: `.serviceList`,
	serviceNameInput: '#inputServiceName'
}

export class ServicesPage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.serviceList, { state: 'visible' })
	}

	public async open() {
		return super.open('services')
	}

	public async clickNewServiceButton() {
		await this.page.click(selectors.addService)
	}

	public async getServiceTitleElement(title: string) {
		const sel = `text=${title}` //`.service-title span[text="${title}""]`
		await this.page.waitForSelector(sel, { state: 'visible' })
		return await this.page.$(sel)
	}
}
