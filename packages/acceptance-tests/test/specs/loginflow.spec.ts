/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import type { Config } from '../config'
import DashboardPage from '../pageobjects/DashboardPage'
import LoginPage from '../pageobjects/LoginPage'
import Header from '../pageobjects/Header'
import LogoutPage from '../pageobjects/LogoutPage'

declare const config: Config

describe('The user login flow', () => {
	beforeEach(async () => {
		await LoginPage.open()
	})
	after(async () => {
		await browser.execute(() => localStorage.clear())
	})
	describe('should log in with valid credentials', () => {
		it('and log out using the header', async () => {
			await LoginPage.login(config.user.login, config.user.password)
			await DashboardPage.waitForLoad()
			await Header.logout()
			await LoginPage.waitForLoad()
		})

		it('and log out via navigation', async () => {
			await LoginPage.login(config.user.login, config.user.password)
			await DashboardPage.waitForLoad()
			await LogoutPage.open()
			await LoginPage.waitForLoad()
		})
	})
})
