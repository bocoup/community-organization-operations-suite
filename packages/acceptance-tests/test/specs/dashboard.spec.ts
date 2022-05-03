/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect, jest/no-done-callback */
import type { Page } from '@playwright/test'
import { test, expect } from '@playwright/test'
import type { PageObjects } from '../pageobjects'
import { createPageObjects } from '../pageobjects'

test.describe('The Dashboard Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await ctx.newPage()
		po = createPageObjects(page)
		await po.sequences.login()
		await po.dashboardPage.open()
		await po.dashboardPage.waitForLoad()
	})

	test('can open up the "Create Request" panel', async ({ page }) => {
		await po.dashboardPage.clickNewRequest()
		await po.newRequestPanel.waitForLoad()
		const isSubmitEnabled = await po.newRequestPanel.isSubmitEnabled()
		expect(isSubmitEnabled).toBe(false)
		await po.newRequestPanel.closePanel()
	})

	test('can open up the "New Client" panel', async ({ page }) => {
		await po.dashboardPage.clickNewClient()
		await po.newClientPanel.waitForLoad()
		const isSubmitEnabled = await po.newClientPanel.isSubmitEnabled()
		expect(isSubmitEnabled).toBe(false)

		await po.newClientPanel.closePanel()
	})

	test('can expand the request panel', async ({ page }) => {
		await po.dashboardPage.expandRequestList()
		await po.dashboardPage.waitForRequestData()
		const numRequests = await po.dashboardPage.countRequestsVisible()
		expect(numRequests).toBeGreaterThan(0)
	})

	test('can expand the closed request panel', async ({ page }) => {
		await po.dashboardPage.expandClosedRequestList()
		await po.dashboardPage.waitForClosedRequestData()
		const numRequests = await po.dashboardPage.countClosedRequestsVisible()
		expect(numRequests).toBeGreaterThan(0)
	})

	test('can start a service using the quickstart menu', async ({ page }) => {
		await po.dashboardPage.clickStartService()
		await po.serviceQuickstartPanel.waitForLoad()
		const availableServices = await po.serviceQuickstartPanel.getAvailableServices()
		expect(availableServices.length).toBeGreaterThan(0)
		await po.serviceQuickstartPanel.clickRecordService(0)
		await po.serviceEntryPage.waitForLoad()
	})
})
