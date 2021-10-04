/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import type { Config } from '../config'
import { DashboardPage, LoginPage, Header, LogoutPage } from '../pageobjects'
import { test } from '@playwright/test'
declare const config: Config

test.describe('The user login flow', () => {
	test.beforeEach(async () => {
		await loginPage.open()
	})
	test.afterAll(async () => {
		await browser.execute(() => localStorage.clear())
	})
	test.describe('should log in with valid credentials', () => {
		test('and log out using the header', async () => {
			await loginPage.login(config.user.login, config.user.password)
			await dashboardPage.waitForLoad()
			await header.logout()
			await loginPage.waitForLoad()
		})

		test('and log out via navigation', async () => {
			await loginPage.login(config.user.login, config.user.password)
			await dashboardPage.waitForLoad()
			await logoutPage.open()
			await loginPage.waitForLoad()
		})
	})
})
