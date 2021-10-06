/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	serviceNameInput: '#inputServiceName',
	btnCreateService: '.btnCreateService',
	btnPreviewService: '.btnPreviewService',
	servicePreviewModal: '.servicePreviewModal'
}
const inputFieldName = (index: number) => `.form-field-${index} .fieldLabel input`

export class AddServicePage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.serviceNameInput, { state: 'visible' })
	}

	public async open() {
		return super.open('services/addService')
	}

	public async enterServiceName(name: string) {
		await this.page.fill(selectors.serviceNameInput, name)
	}

	public async enterFormFieldSingleTextData(index: number, data: string) {
		await this.page.fill(inputFieldName(index), data)
	}

	public async clickPreviewService() {
		await this.page.click(selectors.btnPreviewService)
	}

	public async clickCreateService() {
		await this.page.click(selectors.btnCreateService)
	}

	public async getServicePreviewModal() {
		await this.page.waitForSelector(selectors.servicePreviewModal, { state: 'visible' })
		return this.page.$(selectors.servicePreviewModal)
	}

	public async waitForMessage(message: string) {
		await this.page.waitForSelector(`text="${message}"`, { state: 'visible' })
	}

	public async waitForMessageClear(message: string) {
		await this.page.waitForSelector(`text="${message}"`, { state: 'detached' })
	}
}
