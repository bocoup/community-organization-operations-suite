/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class NewClientPanel extends Page {
	private get newRequestForm() {
		return $(`[data-testid="add-client-form"]`)
	}

	private get btnCreateRequest() {
		return $(`.btnAddClientSubmit`)
	}

	private get btnClose() {
		return $(`button[title="Close"]`)
	}

	public async waitForLoad(): Promise<void> {
		await this.newRequestForm.waitForExist()
	}

	public async closePanel(): Promise<void> {
		await this.btnClose.click()
		await this.newRequestForm.waitUntil(async function (this: WebdriverIO.Element) {
			return !(await this.isExisting())
		})
	}

	public isSubmitEnabled(): Promise<boolean> {
		return this.btnCreateRequest.isEnabled()
	}
}
