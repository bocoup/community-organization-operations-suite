/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
import type { Config } from '../config'
import {
	dashboardPage,
	loginPage,
	logoutPage,
	newClientPanel,
	newRequestPanel
} from '../pageobjects'

declare const config: Config

describe('The Dashboard Page', () => {
	before(async () => {
		await logoutPage.open()
		await loginPage.waitForLoad()
		await loginPage.login(config.user.login, config.user.password)
		await dashboardPage.waitForLoad()
	})
	after(async () => {
		await browser.execute(() => localStorage.clear())
	})

	describe('request creation', () => {
		it('can open the new request panel by clicking "New Request"', async () => {
			await dashboardPage.clickNewRequest()
			await newRequestPanel.waitForLoad()
			const isSubmitEnabled = await newRequestPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await newRequestPanel.closePanel()
		})
	})

	describe('client creation', () => {
		it('can open the new client panel by clicking "New Client"', async () => {
			await dashboardPage.clickNewClient()
			await newClientPanel.waitForLoad()
			const isSubmitEnabled = await newClientPanel.isSubmitEnabled()
			expect(isSubmitEnabled).toBe(false)

			await newClientPanel.closePanel()
		})
	})
})
