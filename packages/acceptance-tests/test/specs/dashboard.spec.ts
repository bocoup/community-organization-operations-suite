/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import config from 'config'
import { Page, test, expect } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageobjects'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('The Dashboard Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		po = createPageObjects(page)
		await po.loginPage.open()
		await po.loginPage.waitForLoad()
		await po.loginPage.login(username, password)
		await po.dashboardPage.waitForLoad()
	})
	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test.describe('request creation', () => {
		test('can open the new request panel by clicking "New Request"', async () => {
			await po.dashboardPage.clickNewRequest()
			await po.newRequestPanel.waitForLoad()
			const isSubmitEnabled = await po.newRequestPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await po.newRequestPanel.closePanel()
		})
	})

	test.describe('client creation', () => {
		test('can open the new client panel by clicking "New Client"', async () => {
			await po.dashboardPage.clickNewClient()
			await po.newClientPanel.waitForLoad()
			const isSubmitEnabled = await po.newClientPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await po.newClientPanel.closePanel()
		})
	})
})
