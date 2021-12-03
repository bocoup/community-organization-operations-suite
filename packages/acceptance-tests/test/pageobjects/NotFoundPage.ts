/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { Page } from './Page'

const selectors: Record<string, string> = {
	container: `.notFoundContainer`
}

export class NotFoundPage extends Page {
	public async waitForLoad() {
		await this.page.waitForSelector(selectors.container, { state: 'visible' })
	}

	public async open(): Promise<void> {
		return super.open('some-fake-path')
	}
}
