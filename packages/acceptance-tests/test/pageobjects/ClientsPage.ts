/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

class ClientsPage extends Page {
	private get clientList() {
		return $(`[data-testid="contact-list"]`)
	}

	public async waitForLoad() {
		await this.clientList.waitForExist()
	}
}

export default new ClientsPage()
