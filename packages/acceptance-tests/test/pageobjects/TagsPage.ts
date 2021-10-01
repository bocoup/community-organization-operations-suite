/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

class TagsPage extends Page {
	private get tagList() {
		return $(`[data-testid="tag-list"]`)
	}

	public async waitForLoad() {
		await this.tagList.waitForExist()
	}
}

export default new TagsPage()
