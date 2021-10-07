/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	newRequestForm: `.addClientForcm`,
	btnSubmit: `.btnAddClientSubmit`,
	btnClose: `button[title="Close"]`
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class NewClientPanel extends Page {
	public async waitForLoad(): Promise<void> {
		await this.page.waitForSelector(selectors.newRequestForm, { state: 'visible' })
	}

	public async closePanel(): Promise<void> {
		await this.page.click(selectors.btnClose)
		await this.page.waitForSelector(selectors.newRequestForm, { state: 'detached' })
	}

	public async isSubmitEnabled(): Promise<boolean> {
		const submit = await this.page.$(selectors.btnSubmit)
		return submit?.isEnabled() ?? false
	}
}
