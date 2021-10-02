/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { Page } from './Page'

export class NotFoundPage extends Page {
	private get notFoundContainer() {
		return $(`[data-testid="not-found-container"]`)
	}

	public async waitForLoad() {
		await this.notFoundContainer.waitForExist()
	}

	public async open(): Promise<void> {
		return super.open('some-fake-path')
	}
}
