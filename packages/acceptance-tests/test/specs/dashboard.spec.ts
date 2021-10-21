/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { test, expect } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageobjects'

test.describe('The Dashboard Page', () => {
	let po: PageObjects

	test.beforeEach(async ({ page }) => {
		po = createPageObjects(page)
		await po.sequences.login()
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

	test('can start a service using the quickstart menu', async () => {
		await po.dashboardPage.clickStartService()
		await po.serviceQuickstartPanel.waitForLoad()
		const availableServices = await po.serviceQuickstartPanel.getAvailableServices()
		expect(availableServices.length).toBeGreaterThan(0)
		await po.serviceQuickstartPanel.clickRecordService(0)
		await po.serviceKioskPage.waitForLoad()
	})
})
