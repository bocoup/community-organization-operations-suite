/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import LoginPage from '../pageobjects/LoginPage'
import SecurePage from '../pageobjects/SecurePage'
import { Expect } from 'expect-webdriverio'
declare const expect: Expect
declare const config: any
describe('The user login flow', () => {
	it('should login with valid credentials', async () => {
		await LoginPage.open()
		await LoginPage.login(config.username, config.password)
		await expect(SecurePage.flashAlert).toBeExisting()
		await expect(SecurePage.flashAlert).toHaveTextContaining('You logged into a secure area!')
	})
})
