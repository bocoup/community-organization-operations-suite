/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	serviceList: `[data-testid="service-list"]`
}

export class ServicesPage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.serviceList, { state: 'visible' })
	}

	public async open() {
		return super.open('services')
	}
}
