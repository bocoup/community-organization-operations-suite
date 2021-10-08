/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect, jest/no-disabled-tests */
import { expect, test } from '@playwright/test'
import { PageObjects } from '../pageobjects'
import { clearLocalStorage, commonStartup, TestContext } from '../scaffold'

test.describe.parallel('The Services Page', () => {
	let ctx: TestContext
	let po: PageObjects

	test.beforeEach(async ({ browser }) => {
		ctx = await commonStartup(browser)
		po = ctx.objects
		await po.sequences.login()
		await po.servicesPage.open()
		await po.servicesPage.waitForLoad()
	})
	test.afterEach(async () => {
		await clearLocalStorage(ctx.page)
	})

	test('can create service with minimal input', async () => {
		const title = 'Food Delivery Service'
		await po.servicesPage.clickNewServiceButton()
		await po.addServicePage.waitForLoad()
		await po.addServicePage.waitForMessage('All fields are required')
		await po.addServicePage.enterServiceName(title)
		await po.addServicePage.enterFormFieldSingleTextData(0, 'Allergens')
		await po.addServicePage.waitForMessageClear('All fields are required')
		await po.addServicePage.clickCreateService()
		await po.servicesPage.waitForLoad()
		await po.servicesPage.getServiceTitleElement(title)
	})

	test('can preview a service', async () => {
		const title = 'Food Delivery Service'
		await po.servicesPage.clickNewServiceButton()
		await po.addServicePage.waitForLoad()
		await po.addServicePage.enterServiceName(title)
		await po.addServicePage.enterFormFieldSingleTextData(0, 'Allergens')

		await po.addServicePage.clickPreviewService()
		const servicePreviewModal = await po.addServicePage.getServicePreviewModal()
		expect(servicePreviewModal).toBeDefined()
	})

	test('can start a service using the service "start" button', async () => {})

	test('can edit an existing service using the service "edit" button', () => {})

	test('can delete an existing service using the service "archive" button', () => {})
})
