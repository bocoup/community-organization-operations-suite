/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

export class ReportPage extends Page {
	private get reportList() {
		return $(`[data-testid="report-list"]`)
	}

	public async waitForLoad() {
		await this.reportList.waitForExist()
		await super.waitForLoad()
	}
}
