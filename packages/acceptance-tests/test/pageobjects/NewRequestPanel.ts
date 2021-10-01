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

	private get addRequestInput() {
		return $(`[data-testid="request-title-input"]`)
	}

	private get requestDurationSelector() {
		return $(`[data-testid="request-duration-select"]`)
	}

	private get clientSelector() {
		return $(`[data-testid="request-client-select"]`)
	}

	private get specialistSelector() {
		return $(`[data-testid="request-specialist-select"]`)
	}

	private get btnCreateRequest() {
		return $(`.btnAddRequestSubmit`)
	}

	private get btnClose() {
		return $(`button[title="Close"]`)
	}

	public async isExisting(): Promise<boolean> {
		return this.newRequestForm.isExisting()
	}

	public async waitForLoad(): Promise<void> {
		await this.newRequestForm.waitForExist()
	}

	public async closePanel(): Promise<void> {
		await this.btnClose.click()
	}

	public isSubmitEnabled(): Promise<boolean> {
		return this.btnCreateRequest.isEnabled()
	}
}

export default new NewRequestPanel()
