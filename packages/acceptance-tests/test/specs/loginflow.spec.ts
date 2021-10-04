/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import config from 'config'
import { createPageObjects, PageObjects } from '../pageobjects'
import { Page, test } from '@playwright/test'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('The user login flow', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		po = createPageObjects(page)
	})

	test.beforeEach(async () => {
		await po.loginPage.open()
		await po.loginPage.waitForLoad()
	})

	test.afterEach(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test.describe('should log in with valid credentials', () => {
		test('and log out using the header', async () => {
			await po.loginPage.login(username, password)
			await po.dashboardPage.waitForLoad()
			await po.header.logout()
			await po.loginPage.waitForLoad()
		})

		test('and log out via navigation', async () => {
			await po.loginPage.login(username, password)
			await po.dashboardPage.waitForLoad()
			await po.logoutPage.open()
			await po.loginPage.waitForLoad()
		})
	})
})
