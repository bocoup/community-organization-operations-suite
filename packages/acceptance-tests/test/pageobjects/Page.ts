/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
import config from 'config'
import { Page as PWPage } from '@playwright/test'

const selectors: Record<string, string> = {
	spinners: '.waitSpinner',
	body: 'body'
}

export class Page {
	public constructor(private _page: PWPage) {}

	protected get page() {
		return this._page
	}

	protected get rootUrl() {
		return config.get<string>('url')
	}

	protected async waitForLoad() {
		await this.page.waitForSelector(selectors.body)
		await this.page.waitForSelector(selectors.spinners, { state: 'detached' })
	}

	/**
	 * Opens a sub page of the page
	 * @param path path of the sub page (e.g. /path/to/page.html)
	 */
	protected async open(path: string): Promise<void> {
		this.page.goto(`${this.rootUrl}/${path}`)
	}
}
