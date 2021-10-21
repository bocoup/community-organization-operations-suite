/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect,jest/no-done-callback */
import { test, expect, Page } from '@playwright/test'
import { PageObjects, createPageObjects } from '../pageobjects'

test.describe('The application header', () => {
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

	test('can navigate to dashboard page', async () => {
		await po.servicesPage.open()
		await po.servicesPage.waitForLoad()
		await po.header.clickDashboardLink()
		await po.dashboardPage.waitForLoad()
	})

	test('can navigate to services page', async () => {
		await po.header.clickServicesLink()
		await po.servicesPage.waitForLoad()
	})

	test('can navigate to specialists page', async () => {
		await po.header.clickSpecialistsLink()
		await po.specialistsPage.waitForLoad()
	})

	test('can navigate to clients page', async () => {
		await po.header.clickClientsLink()
		await po.clientsPage.waitForLoad()
	})

	test('can navigate to tags page', async () => {
		await po.header.clickTagsLink()
		await po.tagsPage.waitForLoad()
	})

	test('can navigate to reporting page', async () => {
		await po.header.clickReportingLink()
		await po.reportPage.waitForLoad()
	})

	test('can navigate to profile page', async () => {
		await po.profilePage.open()
		await po.profilePage.waitForLoad()
	})

	test('can navigate to not-found page', async () => {
		await po.notFoundPage.open()
		await po.notFoundPage.waitForLoad()
	})

	test('can switch between languages', async ({ page }) => {
		await po.dashboardPage.open()
		await po.dashboardPage.waitForLoad()
		await po.sequences.selectSpanishLanguage()
		await po.dashboardPage.waitForLoad()

		let createRequestLabelText = await po.dashboardPage.getNewRequestLabel()
		expect(createRequestLabelText).toContain('Crear una solicitud')

		await po.sequences.selectEnglishLanguage()
		await po.dashboardPage.waitForLoad()

		createRequestLabelText = await po.dashboardPage.getNewRequestLabel()
		expect(createRequestLabelText).toContain('Create a Request')
	})

	test('can show notifications pane', async () => {
		await po.header.clickNotificationsBell()
		await po.header.waitForNotificationsPanelToShow()
	})
})
