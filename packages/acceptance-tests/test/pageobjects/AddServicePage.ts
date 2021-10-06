/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	serviceNameInput: '#inputServiceName',
	btnCreateService: '.btnCreateService'
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

	public async clickCreateService() {
		await this.page.click(selectors.btnCreateService)
	}
}
