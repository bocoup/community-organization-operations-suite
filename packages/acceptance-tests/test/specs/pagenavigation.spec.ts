/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect, jest/no-commented-out-tests */
// import { Expect } from 'expect-webdriverio'
import type { Config } from '../config'
import DashboardPage from '../pageobjects/DashboardPage'
import LoginPage from '../pageobjects/LoginPage'
import Header from '../pageobjects/Header'
import ServicesPage from '../pageobjects/ServicesPage'
import SpecialistsPage from '../pageobjects/SpecialistsPage'
import ClientsPage from '../pageobjects/ClientsPage'
import ProfilePage from '../pageobjects/ProfilePage'
import ReportingPage from '../pageobjects/ReportingPage'
import TagsPage from '../pageobjects/TagsPage'
// import NotFoundPage from '../pageobjects/NotFoundPage'

declare const config: Config
// declare const expect: Expect

describe('Top-level page navigation', () => {
	before(async () => {
		await LoginPage.open()
		await LoginPage.login(config.user.login, config.user.password)
		await DashboardPage.waitForLoad()
	})

	beforeEach(async () => {
		await DashboardPage.open()
	})

	after(async () => {
		await Header.logout()
		await LoginPage.waitForLoad()
		await browser.execute(() => localStorage.clear())
	})

	it('can navigate to services page', async () => {
		await Header.clickServices()
		await ServicesPage.waitForLoad()
	})

	it('can navigate to specialists page', async () => {
		await Header.clickSpecialists()
		await SpecialistsPage.waitForLoad()
	})

	it('can navigate to clients page', async () => {
		await Header.clickClients()
		await ClientsPage.waitForLoad()
	})

	it('can navigate to tags page', async () => {
		await Header.clickTags()
		await TagsPage.waitForLoad()
	})

	it('can navigate to reporting page', async () => {
		await Header.clickReporting()
		await ReportingPage.waitForLoad()
	})

	it('can navigate to profile page', async () => {
		await ProfilePage.open()
		await ProfilePage.waitForLoad()
	})
})
