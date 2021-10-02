/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import type { Config } from '../config'
import { dashboardPage, loginPage, header, logoutPage } from '../pageobjects'

declare const config: Config

describe('The user login flow', () => {
	beforeEach(async () => {
		await loginPage.open()
	})
	after(async () => {
		await browser.execute(() => localStorage.clear())
	})
	describe('should log in with valid credentials', () => {
		it('and log out using the header', async () => {
			await loginPage.login(config.user.login, config.user.password)
			await dashboardPage.waitForLoad()
			await header.logout()
			await loginPage.waitForLoad()
		})

		it('and log out via navigation', async () => {
			await loginPage.login(config.user.login, config.user.password)
			await dashboardPage.waitForLoad()
			await logoutPage.open()
			await loginPage.waitForLoad()
		})
	})
})
