/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import config from 'config'
import { Page, test, expect } from '@playwright/test'
import { DashboardPage, LoginPage, NewClientPanel, NewRequestPanel } from '../pageobjects'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('The Dashboard Page', () => {
	let page: Page
	let dashboard: DashboardPage
	let newRequestPanel: NewRequestPanel

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		const loginPage = new LoginPage(page)
		dashboard = new DashboardPage(page)
		newRequestPanel = new NewRequestPanel(page)

		await loginPage.open()
		await loginPage.waitForLoad()
		await loginPage.login(username, password)
		await dashboard.waitForLoad()
	})
	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test.describe('request creation', () => {
		test('can open the new request panel by clicking "New Request"', async () => {
			await dashboard.clickNewRequest()
			await newRequestPanel.waitForLoad()
			const isSubmitEnabled = await newRequestPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await newRequestPanel.closePanel()
		})
	})

	test.describe('client creation', () => {
		let newClientPanel: NewClientPanel
		test.beforeAll(() => {
			newClientPanel = new NewClientPanel(page)
		})
		test('can open the new client panel by clicking "New Client"', async () => {
			await dashboard.clickNewClient()
			await newClientPanel.waitForLoad()
			const isSubmitEnabled = await newClientPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await newClientPanel.closePanel()
		})
	})
})
