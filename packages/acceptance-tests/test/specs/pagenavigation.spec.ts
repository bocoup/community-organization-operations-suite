/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
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

describe('Top-level page navigation', () => {
	before(async () => {
		await loginPage.open()
		await loginPage.login(config.user.login, config.user.password)
		await dashboardPage.waitForLoad()
	})

	beforeEach(async () => {
		await dashboardPage.open()
	})

	after(async () => {
		await logoutPage.open()
		await loginPage.waitForLoad()
		await browser.execute(() => localStorage.clear())
	})

	it('can navigate to services page', async () => {
		await header.clickServices()
		await servicesPage.waitForLoad()
	})

	it('can navigate to specialists page', async () => {
		await header.clickSpecialists()
		await specialistsPage.waitForLoad()
	})

	it('can navigate to clients page', async () => {
		await header.clickClients()
		await clientsPage.waitForLoad()
	})

	it('can navigate to tags page', async () => {
		await header.clickTags()
		await tagsPage.waitForLoad()
	})

	it('can navigate to reporting page', async () => {
		await header.clickReporting()
		await reportPage.waitForLoad()
	})

	it('can navigate to profile page', async () => {
		await profilePage.open()
		await profilePage.waitForLoad()
	})

	it('can navigate to not-found page', async () => {
		await notFoundPage.open()
		await notFoundPage.waitForLoad()
	})
})
