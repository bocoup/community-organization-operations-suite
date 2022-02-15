/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect,jest/no-done-callback */
import config from 'config'
import { createPageObjects, PageObjects } from '../pageobjects'
import { Page, expect, test } from '@playwright/test'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('The user login flow', () => {
	let page: Page
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.loginPage.open()
	})
	test.describe('should log in with valid credentials', () => {
		test('and log out using the header', async ({ page }) => {
			await po.loginPage.login(username, password)
			await po.dashboardPage.waitForLoad()
			await po.header.logout()
			await po.loginPage.waitForLoad()
		})

		test('and log out via navigation', async ({ page }) => {
			await po.loginPage.login(username, password)
			await po.dashboardPage.waitForLoad()
			await po.logoutPage.open()
			await po.loginPage.waitForLoad()
		})
	})
	test.describe('should not log in with regex matching valid login', () => {
		test('and error due to invalid credentials', async ({ page }) => {
			await po.loginPage.login('.*@curamericas.com', password)
			const isErrored = await po.loginPage.isErrored()
			expect(isErrored).toBe(false)
		})
	})
})
