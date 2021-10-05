/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { Page, test } from '@playwright/test'
import { PageObjects, createPageObjects } from '../pageobjects'

test.describe('Top-level page navigation', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		po = createPageObjects(page)
		await po.sequences.login()
	})

	test.beforeEach(async () => {
		await po.dashboardPage.open()
		await po.dashboardPage.waitForLoad()
	})

	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test('can navigate to services page', async () => {
		await po.header.clickServices()
		await po.servicesPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/services_page.png' })
	})

	test('can navigate to specialists page', async () => {
		await po.header.clickSpecialists()
		await po.specialistsPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/specialists_page.png' })
	})

	test('can navigate to clients page', async () => {
		await po.header.clickClients()
		await po.clientsPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/clients_page.png' })
	})

	test('can navigate to tags page', async () => {
		await po.header.clickTags()
		await po.tagsPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/tags_page.png' })
	})

	test('can navigate to reporting page', async () => {
		await po.header.clickReporting()
		await po.reportPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/reporting_page.png' })
	})

	test('can navigate to profile page', async () => {
		await po.profilePage.open()
		await po.profilePage.waitForLoad()
		await page.screenshot({ path: 'screenshots/profile_page.png' })
	})

	test('can navigate to not-found page', async () => {
		await po.notFoundPage.open()
		await po.notFoundPage.waitForLoad()
		await page.screenshot({ path: 'screenshots/not_found_page.png' })
	})
})
