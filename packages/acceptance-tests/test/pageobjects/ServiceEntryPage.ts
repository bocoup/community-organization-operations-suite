/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	pageContainer: '.serviceEntryPage'
}

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class ServiceEntryPage extends Page {
	public async waitForLoad(): Promise<void> {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.pageContainer, { state: 'visible' })
	}
}
