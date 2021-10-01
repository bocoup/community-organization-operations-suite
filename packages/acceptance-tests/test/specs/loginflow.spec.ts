/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable jest/expect-expect */
// import { Expect } from 'expect-webdriverio'
import type { Config } from '../config'
import DashboardPage from '../pageobjects/DashboardPage'
import LoginPage from '../pageobjects/LoginPage'
import Header from '../pageobjects/Header'

declare const config: Config
// declare const expect: Expect

describe('The user login flow', () => {
	it('should login with valid credentials and log out', async () => {
		await LoginPage.open()
		await LoginPage.login(config.user.login, config.user.password)
		await DashboardPage.waitForLoad()

		await Header.logout()
		await LoginPage.waitForLoad()
	})
})
