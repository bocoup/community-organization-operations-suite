/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import LoginPage from '../pageobjects/LoginPage'
import { Expect } from 'expect-webdriverio'
import { getConfig } from '../config'
import DashboardPage from '../pageobjects/DashboardPage'

declare const expect: Expect

describe('The user login flow', () => {
	it('should login with valid credentials', async () => {
		const config = getConfig()
		await LoginPage.open()
		await LoginPage.login(config.user.login, config.user.password)
		await expect(DashboardPage.requestList).toBeExisting()
	})
})
