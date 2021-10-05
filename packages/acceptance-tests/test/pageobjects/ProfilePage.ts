/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	form: `[data-testid="profile-form"]`
}
export class ProfilePage extends Page {
	public async waitForLoad() {
		// await super.waitForLoad()
		await this.page.waitForSelector(selectors.form, { state: 'visible' })
	}

	public open() {
		return super.open('account')
	}
}
