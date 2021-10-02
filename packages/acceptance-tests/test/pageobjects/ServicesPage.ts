/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

export class ServicesPage extends Page {
	private get servicesList() {
		return $(`[data-testid="service-list"]`)
	}

	public async waitForLoad() {
		await this.servicesList.waitForExist()
		await super.waitForLoad()
	}
}
