/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import type { Config } from '../config'
import DashboardPage from '../pageobjects/DashboardPage'
import LoginPage from '../pageobjects/LoginPage'
import Header from '../pageobjects/Header'

declare const config: Config

describe('The user login flow', () => {
	after(async () => {
		await browser.execute(() => localStorage.clear())
	})

	it('should login with valid credentials and log out', async () => {
		await LoginPage.open()
		await LoginPage.login(config.user.login, config.user.password)
		await DashboardPage.waitForLoad()

		await Header.logout()
		await LoginPage.waitForLoad()
	})
})
