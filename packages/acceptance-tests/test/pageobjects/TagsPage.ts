/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	tagList: `[data-testid="tag-list"]`,
	btnAddTag: '.btnAddItem'
}
export class TagsPage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.tagList, { state: 'visible' })
	}

	public async clickAddTag() {
		await this.page.click(selectors.btnAddTag)
	}
}
