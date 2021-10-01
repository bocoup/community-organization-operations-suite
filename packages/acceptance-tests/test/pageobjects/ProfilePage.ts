/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Page from './Page'

class ProfilePage extends Page {
	private get profileForm() {
		return $(`[data-testid="profile-form"]`)
	}

	public async waitForLoad() {
		await this.profileForm.waitForExist()
	}

	public open() {
		return super.open('account')
	}
}

export default new ProfilePage()
