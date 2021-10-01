/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class NewRequestPanel extends Page {
	private get newRequestForm() {
		return $(`[data-testid="add-request-form"]`)
	}

	public async waitForLoad(): Promise<void> {
		await this.newRequestForm.waitForExist()
	}
}

export default new NewRequestPanel()
