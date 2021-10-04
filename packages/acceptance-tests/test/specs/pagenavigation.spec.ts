/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { test } from '@playwright/test'
import type { Config } from '../config'
import {
	loginPage,
	logoutPage,
	header,
	servicesPage,
	specialistsPage,
	profilePage,
	reportPage,
	tagsPage,
	notFoundPage,
	clientsPage,
	dashboardPage
} from '../pageobjects'

declare const config: Config

test.describe('Top-level page navigation', () => {
	test.beforeAll(async () => {
		await loginPage.open()
		await loginPage.login(config.user.login, config.user.password)
		await dashboardPage.waitForLoad()
	})

	test.beforeEach(async () => {
		await dashboardPage.open()
	})

	test.afterAll(async () => {
		await logoutPage.open()
		await loginPage.waitForLoad()
		await browser.execute(() => localStorage.clear())
	})

	test('can navigate to services page', async () => {
		await header.clickServices()
		await servicesPage.waitForLoad()
	})

	test('can navigate to specialists page', async () => {
		await header.clickSpecialists()
		await specialistsPage.waitForLoad()
	})

	test('can navigate to clients page', async () => {
		await header.clickClients()
		await clientsPage.waitForLoad()
	})

	test('can navigate to tags page', async () => {
		await header.clickTags()
		await tagsPage.waitForLoad()
	})

	test('can navigate to reporting page', async () => {
		await header.clickReporting()
		await reportPage.waitForLoad()
	})

	test('can navigate to profile page', async () => {
		await profilePage.open()
		await profilePage.waitForLoad()
	})

	test('can navigate to not-found page', async () => {
		await notFoundPage.open()
		await notFoundPage.waitForLoad()
	})
})
