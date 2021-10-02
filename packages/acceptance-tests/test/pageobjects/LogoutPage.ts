/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Page } from './Page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class LogoutPage extends Page {
	/**
	 * overwrite specific options to adapt it to page object
	 */
	public open() {
		return super.open('logout')
	}
}
