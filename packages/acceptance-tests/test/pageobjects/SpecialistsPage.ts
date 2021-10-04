/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

const selectors: Record<string, string> = {
	specialistList: `[data-testid="specialist-list"]`
}
export class SpecialistsPage extends Page {
	public async waitForLoad() {
		await super.waitForLoad()
		await this.page.waitForSelector(selectors.specialistList, { state: 'visible' })
	}
}
