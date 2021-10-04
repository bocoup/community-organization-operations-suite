/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import { Page, test } from '@playwright/test'
import config from 'config'
import {
	LoginPage,
	Header,
	ServicesPage,
	SpecialistsPage,
	ProfilePage,
	ReportPage,
	TagsPage,
	NotFoundPage,
	ClientsPage,
	DashboardPage
} from '../pageobjects'

const username = config.get<string>('user.login')
const password = config.get<string>('user.password')

test.describe('Top-level page navigation', () => {
	let page: Page
	let dashboard: DashboardPage
	let header: Header
	let login: LoginPage
	let services: ServicesPage
	let profile: ProfilePage
	let tags: TagsPage
	let reports: ReportPage
	let specialists: SpecialistsPage
	let clients: ClientsPage
	let notFound: NotFoundPage

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage()
		login = new LoginPage(page)
		dashboard = new DashboardPage(page)
		header = new Header(page)
		services = new ServicesPage(page)
		profile = new ProfilePage(page)
		tags = new TagsPage(page)
		reports = new ReportPage(page)
		specialists = new SpecialistsPage(page)
		clients = new ClientsPage(page)
		notFound = new NotFoundPage(page)

		await login.open()
		await login.login(username, password)
		await dashboard.waitForLoad()
	})

	test.beforeEach(async () => {
		await dashboard.waitForLoad()
	})

	test.afterAll(async () => {
		await page.evaluate(() => localStorage.clear())
	})

	test('can navigate to services page', async () => {
		await header.clickServices()
		await services.waitForLoad()
		await page.screenshot({ path: 'screenshots/services_page.png' })
	})

	test('can navigate to specialists page', async () => {
		await header.clickSpecialists()
		await specialists.waitForLoad()
		await page.screenshot({ path: 'screenshots/specialists_page.png' })
	})

	test('can navigate to clients page', async () => {
		await header.clickClients()
		await clients.waitForLoad()
		await page.screenshot({ path: 'screenshots/clients_page.png' })
	})

	test('can navigate to tags page', async () => {
		await header.clickTags()
		await tags.waitForLoad()
		await page.screenshot({ path: 'screenshots/tags_page.png' })
	})

	test('can navigate to reporting page', async () => {
		await header.clickReporting()
		await reports.waitForLoad()
		await page.screenshot({ path: 'screenshots/reporting_page.png' })
	})

	test('can navigate to profile page', async () => {
		await profile.open()
		await profile.waitForLoad()
		await page.screenshot({ path: 'screenshots/profile_page.png' })
	})

	test('can navigate to not-found page', async () => {
		await notFound.open()
		await notFound.waitForLoad()
		await page.screenshot({ path: 'screenshots/not_found_page.png' })
	})
})
