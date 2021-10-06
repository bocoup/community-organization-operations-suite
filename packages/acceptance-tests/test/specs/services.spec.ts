/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { Page, test } from '@playwright/test'
import { createPageObjects, PageObjects } from '../pageobjects'

test.describe('The Services Page', () => {
	let page: Page
	let po: PageObjects

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		po = createPageObjects(page)
		await po.sequences.login()
		await po.servicesPage.open()
		await po.servicesPage.waitForLoad()
	})
	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test('can create service with minimal input', async () => {
		await po.servicesPage.clickNewServiceButton()
		await po.addServicePage.waitForLoad()
		await po.addServicePage.enterServiceName('Test Service [can create services]')
	})

	test('can create service with all input', async () => {
		await po.servicesPage.clickNewServiceButton()
		await po.addServicePage.waitForLoad()
		await po.addServicePage.enterServiceName('Test Service [can create services]')
	})

	test('will emit errors if not all fields are entered', async () => {})

	test.describe('can start a new service', () => {
		test('using the quickstart button', async () => {})
		test('using the service "start" button', async () => {})
	})

	test.describe('can edit an existing service', () => {})

	test.describe('can delete an existing service', () => {})
})