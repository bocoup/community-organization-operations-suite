/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

export class SpecialistsPage extends Page {
	private get specialistList() {
		return $(`[data-testid="specialist-list"]`)
	}

	public async waitForLoad() {
		await this.specialistList.waitForExist()
		await super.waitForLoad()
	}
}
