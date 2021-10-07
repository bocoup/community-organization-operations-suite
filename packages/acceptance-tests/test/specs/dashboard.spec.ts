/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { Page, test, expect } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageobjects'

test.describe('The Dashboard Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		po = createPageObjects(page)
		await po.sequences.login()
	})
	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test('can open up the "Create Request" panel', async () => {
		await po.dashboardPage.clickNewRequest()
		await po.newRequestPanel.waitForLoad()
		const isSubmitEnabled = await po.newRequestPanel.isSubmitEnabled()
		expect(isSubmitEnabled).toBe(false)

		await po.newRequestPanel.closePanel()
	})

	test('can open up the "New Client" panel', async () => {
		await po.dashboardPage.clickNewClient()
		await po.newClientPanel.waitForLoad()
		const isSubmitEnabled = await po.newClientPanel.isSubmitEnabled()
		expect(isSubmitEnabled).toBe(false)

		await po.newClientPanel.closePanel()
	})

	test('can expand the request panel', async () => {
		await po.dashboardPage.expandRequestList()
		await po.dashboardPage.waitForRequestData()
		const numRequests = await po.dashboardPage.countRequestsVisible()
		expect(numRequests).toBeGreaterThan(0)
	})

	test('can expand the closed request panel', async () => {
		await po.dashboardPage.expandClosedRequestList()
		await po.dashboardPage.waitForClosedRequestData()
		const numRequests = await po.dashboardPage.countClosedRequestsVisible()
		expect(numRequests).toBeGreaterThan(0)
	})
})
