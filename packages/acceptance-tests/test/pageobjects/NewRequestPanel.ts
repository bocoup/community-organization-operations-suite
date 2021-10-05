/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	form: `[data-testid="add-request-form"]`,
	btnClose: `button[title="Close"]`,
	btnCreateRequest: `.btnAddRequestSubmit`,
	specialistPicker: `[data-testid="request-specialist-select"]`,
	clientPicker: `[data-testid="request-client-select"]`,
	durationPicker: `[data-testid="request-duration-select"]`,
	inputTitle: `[data-testid="request-title-input"]`
}
/**
 * sub page containing specific selectors and methods for a specific page
 */
export class NewRequestPanel extends Page {
	public async waitForLoad(): Promise<void> {
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public async closePanel(): Promise<void> {
		await this.page.click(selectors.btnClose)
		await this.page.waitForSelector(selectors.form, { state: 'detached' })
	}

	public async isSubmitEnabled(): Promise<boolean> {
		const btnSubmit = await this.page.$(selectors.btnCreateRequest)
		return btnSubmit?.isEnabled() ?? false
	}
}
