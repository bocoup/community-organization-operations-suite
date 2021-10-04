/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import config from 'config'
import { DashboardPage, LoginPage, Header, LogoutPage } from '../pageobjects'
import { Page, test } from '@playwright/test'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('The user login flow', () => {
	let page: Page
	let dashboard: DashboardPage
	let header: Header
	let logout: LogoutPage
	let login: LoginPage

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		login = new LoginPage(page)
		logout = new LogoutPage(page)
		dashboard = new DashboardPage(page)
		header = new Header(page)
	})

	test.beforeEach(async () => {
		await login.open()
	})
	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test.describe('should log in with valid credentials', () => {
		test('and log out using the header', async () => {
			await login.login(username, password)
			await dashboard.waitForLoad()
			await header.logout()
			await login.waitForLoad()
		})

		test('and log out via navigation', async () => {
			await login.login(username, password)
			await dashboard.waitForLoad()
			await logout.open()
			await login.waitForLoad()
		})
	})
})
